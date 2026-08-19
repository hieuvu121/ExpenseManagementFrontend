import { ME } from "../constants/config";
import type {
  Highlight,
  Household,
  Member,
  ParsedExpense,
} from "../types/domain";
import { daysAgo, TODAY } from "./date";
import { guessCategory } from "./guessCategory";
import { stripDiacritics } from "./text";

/**
 * Reads expenses out of free text, in English or Vietnamese.
 *
 * Everything is matched against a diacritic-stripped copy of the sentence,
 * which is the same length as the original (Vietnamese precomposed characters
 * decompose to one base character plus combining marks, and the marks are
 * dropped), so offsets found in the folded text index the original directly.
 * That is what lets the UI highlight the exact words the parser used.
 */

/** First-person pronouns that mean "the signed-in member paid". */
const SELF_WORDS = ["t", "tao", "tui", "toi", "minh", "tro", "i", "me"];

/** Folded words that never belong in a title. */
const STOP = new Set(
  ("tra,ung,mua,dat,thanh,toan,truoc,da,chia,deu,het,cho,nhom,tat,moi,nguoi,dua,voi,va,roi,nhe,luon,cua,minh,t,tao,tui,quet,giup,ho,i,me,my,we,us,our,paid,pay,pays,bought,buy,got,ordered,covered,the,a,an,and,for,with,to,of,everyone,everybody,all,each,ways,way,evenly,even,yesterday,today,tonight,tomorrow,this,last,morning,afternoon,evening,night,just,now,also,then").split(
    ",",
  ),
);

/** Words meaning "the group", used to drop "cả nhà" / "cả nhóm" from titles. */
const GROUP_WORDS = new Set(["nhom", "nha", "lu", "bon", "team", "doi"]);

/** Accented stop words, checked before folding so "trả" is dropped but not a name. */
const ACCENTED_STOP = new Set(
  "trả,ứng,trước,đã,chia,đều,hết,cho,nhóm,tất,mọi,người,đứa,với,và,rồi,nhé,luôn,của,mình,mua,giúp,hộ,thanh,toán,quẹt,đặt".split(
    ",",
  ),
);

/** "tối qua", "sáng nay" — time-of-day plus a marker, dropped as a pair. */
const TIME_WORDS = new Set(["toi", "sang", "trua", "chieu", "dem", "hom", "ngay", "bua"]);
const TIME_MARKERS = new Set(["qua", "nay", "kia"]);

/**
 * Names that collide with ordinary words once folded — "An" the person versus
 * "ăn" (to eat), "Ta" versus "ta". These only count as a name when the original
 * text capitalised them.
 */
const AMBIGUOUS = new Set([
  "an", "a", "i", "me", "my", "be", "la", "ta", "ho", "cho",
  "may", "mai", "so", "do", "no", "co", "can", "us", "we",
]);

const nameIsCapitalised = (original: string, index: number, folded: string) =>
  !AMBIGUOUS.has(folded) || /[A-ZÀ-ỸĐ]/.test(original[index] ?? "");

/** Index of `word` in `haystack` at a word boundary, or -1. */
function findWord(haystack: string, word: string): number {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp("(^|[^a-z0-9])(" + escaped + ")(?![a-z0-9])");
  const m = re.exec(haystack);
  return m ? m.index + m[1].length : -1;
}

interface AmountMatch {
  value: number;
  start: number;
  end: number;
}

/**
 * Recognises, in order: "1tr280" / "1.2m" / "2 triệu", "165k" / "850 nghìn",
 * and bare numbers like "540000" or "1.280.000".
 */
export function findAmount(s: string): AmountMatch | null {
  const patterns = [
    /(\d+(?:[.,]\d+)?)\s*(?:tr|triệu|trieu|mil|m)\s*(\d{1,3})?\b/i,
    /(\d+(?:[.,]\d+)?)\s*(?:k|nghìn|nghin|ngàn|ngan)\b/i,
    /(\d{1,3}(?:\.\d{3})+|\d{4,9})/,
  ];

  for (let i = 0; i < patterns.length; i++) {
    const m = patterns[i].exec(s);
    if (!m) continue;

    const lead = parseFloat(m[1].replace(",", "."));
    let value: number;

    if (i === 0) {
      // "1tr280" -> 1,280,000: the tail is scaled by its own digit count.
      const tail = m[2] ? parseInt(m[2], 10) * Math.pow(10, 6 - m[2].length) : 0;
      value = lead * 1e6 + tail;
    } else if (i === 1) {
      value = lead * 1e3;
    } else {
      value = parseInt(m[1].replace(/\./g, ""), 10);
    }

    if (value > 0) return { value, start: m.index, end: m.index + m[0].length };
  }
  return null;
}

/**
 * Builds a title from whatever words are left once the amount, the member
 * names, the payment verbs and the time expressions have been removed.
 */
function makeTitle(raw: string, household: Household): string {
  const foldedMembers = new Set(household.members.map(stripDiacritics));
  const rawMembers = new Set(household.members.map((m) => m.toLowerCase()));

  const tokens = raw.replace(/[,.;:!?]/g, " ").split(/\s+/).filter(Boolean);
  const folded = tokens.map((t) => stripDiacritics(t).replace(/[^a-z0-9]/g, ""));
  const kept: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const word = folded[i];
    if (!word) continue;
    // Everything after "split"/"chia" describes the split, not the purchase.
    if (word === "chia" || word === "split") break;

    const bare = tokens[i].toLowerCase().replace(/[^0-9a-zà-ỹđ]/gi, "");
    const hasDiacritics = stripDiacritics(bare) !== bare;
    const isStop = hasDiacritics
      ? ACCENTED_STOP.has(bare) || rawMembers.has(bare)
      : STOP.has(word) || foldedMembers.has(word);
    if (isStop) continue;

    const prev = folded[i - 1] ?? "";
    const next = folded[i + 1] ?? "";

    if (word === "hom") continue;
    if ((word === "ca" || word === "tat") && (GROUP_WORDS.has(next) || next === "ca")) continue;
    if (GROUP_WORDS.has(word) && (prev === "ca" || prev === "tat")) continue;
    if (TIME_WORDS.has(word) && (TIME_MARKERS.has(next) || TIME_MARKERS.has(prev))) continue;
    if (TIME_MARKERS.has(word) && (TIME_WORDS.has(prev) || TIME_WORDS.has(next))) continue;

    kept.push(tokens[i]);
    if (kept.length >= 6) break;
  }

  const title = kept.join(" ").trim();
  if (!title) return "Expense";
  return title[0].toUpperCase() + title.slice(1);
}

interface Span {
  start: number;
  end: number;
  kind: NonNullable<Highlight["kind"]>;
}

/** Cuts the sentence into tagged runs so the UI can underline what was read. */
function toHighlights(sentence: string, spans: Span[]): Highlight[] {
  const ordered = [...spans].sort((a, b) => a.start - b.start);
  const out: Highlight[] = [];
  let cursor = 0;

  for (const span of ordered) {
    if (span.start < cursor) continue; // overlapping match, keep the first
    if (span.start > cursor) {
      out.push({ text: sentence.slice(cursor, span.start), kind: null });
    }
    out.push({ text: sentence.slice(span.start, span.end), kind: span.kind });
    cursor = span.end;
  }
  if (cursor < sentence.length) {
    out.push({ text: sentence.slice(cursor), kind: null });
  }
  return out;
}

const PAY_VERBS =
  /(^|[^a-z0-9])(tra|ung|thanh toan|mua|order|dat|quet|ship|bao|paid|pay|bought|buy|ordered|covered|got|fronted)(?![a-z0-9])/g;

const SPLIT_ALL =
  /(chia deu|ca nhom|tat ca|moi nguoi|chia het|chia \d+|\d+ dua|\d+ nguoi|split evenly|split equally|evenly|equally|everyone|everybody|all of us|each of us|whole house|\d+ ways)/;

/** One sentence can only describe one expense; several sentences give several. */
export function parseExpenseText(text: string, household: Household): ParsedExpense[] {
  const sentences = text
    .split(/[;\n]+|\.(?!\d)/)
    .map((x) => x.trim())
    .filter(Boolean);

  const out: ParsedExpense[] = [];

  for (const sentence of sentences) {
    const amount = findAmount(sentence);
    if (!amount) continue;

    const flat = stripDiacritics(sentence);
    const spans: Span[] = [{ start: amount.start, end: amount.end, kind: "amount" }];

    // --- who paid: find a payment verb, then the nearest name before it ---
    const verbPositions = [...flat.matchAll(PAY_VERBS)].map(
      (m) => m.index! + m[1].length,
    );

    /** Nearest name or first-person pronoun in [from, before). */
    const nearestName = (before: number, from: number) => {
      const candidates: { at: number; length: number; name: Member }[] = [];

      household.members.forEach((member) => {
        const folded = stripDiacritics(member);
        let offset = 0;
        let at = findWord(flat.slice(0, before), folded);
        while (at > -1) {
          const absolute = offset + at;
          if (absolute >= from && nameIsCapitalised(sentence, absolute, folded)) {
            candidates.push({ at: absolute, length: folded.length, name: member });
          }
          offset += at + folded.length;
          at = findWord(flat.slice(offset, before), folded);
        }
      });

      SELF_WORDS.forEach((word) => {
        const at = findWord(flat.slice(from, before), word);
        if (at > -1) {
          candidates.push({ at: from + at, length: word.length, name: ME });
        }
      });

      return candidates.sort((a, b) => b.at - a.at)[0];
    };

    let payer: Member = ME;
    let payerSpan: Span | null = null;

    for (const verbAt of verbPositions) {
      // Look back a short window first — "Huy mua cà phê" beats a name further off.
      const pick = nearestName(verbAt, Math.max(0, verbAt - 18));
      if (pick) {
        payer = pick.name;
        payerSpan = { start: pick.at, end: pick.at + pick.length, kind: "payer" };
        break;
      }
    }
    if (!payerSpan && verbPositions.length) {
      const pick = nearestName(verbPositions[0], 0);
      if (pick) {
        payer = pick.name;
        payerSpan = { start: pick.at, end: pick.at + pick.length, kind: "payer" };
      }
    }
    if (payerSpan) spans.push(payerSpan);

    // --- who it is split between ---
    let participants: Member[];
    const splitAll = SPLIT_ALL.exec(flat);

    if (splitAll) {
      participants = [...household.members];
      spans.push({
        start: splitAll.index,
        end: splitAll.index + splitAll[0].length,
        kind: "split",
      });
    } else {
      const named: Member[] = [];
      household.members.forEach((member) => {
        const folded = stripDiacritics(member);
        const at = findWord(flat, folded);
        if (at > -1 && nameIsCapitalised(sentence, at, folded) && at !== payerSpan?.start) {
          named.push(member);
          spans.push({ start: at, end: at + member.length, kind: "split" });
        }
      });
      // Naming people implies the payer is in too; naming nobody means everyone.
      participants = named.length
        ? [...new Set([payer, ...named])]
        : [...household.members];
    }

    // --- when ---
    let date = new Date(TODAY);
    if (/hom qua|toi qua|dem qua|chieu qua|sang qua|yesterday|last night/.test(flat)) {
      date = daysAgo(1);
    } else if (/hom kia|day before yesterday/.test(flat)) {
      date = daysAgo(2);
    }

    const title = makeTitle(
      sentence.slice(0, amount.start) + " " + sentence.slice(amount.end),
      household,
    );

    out.push({
      title,
      amount: amount.value,
      payer,
      participants,
      date,
      category: guessCategory(title),
      highlights: toHighlights(sentence, spans),
      dropped: false,
    });
  }

  return out;
}
