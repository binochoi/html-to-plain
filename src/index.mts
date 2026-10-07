/** HTML 문자열을 사람이 읽을 plain text 로 변환한다.
 *
 * TipTap 등이 만든 HTML(`<p>…</p>`, `<ul><li>…`) 에서 태그를 걷어내고 엔티티를
 * 디코드한다. Cloudflare Workers 처럼 DOMParser 가 없는 런타임에서도 쓰도록
 * 정규식 기반으로 처리한다 — 의존성이 전혀 없어 어디서든 재사용 가능하다. */

/** `&amp;` 같은 명명 엔티티 최소 집합. 그 외는 숫자 엔티티로 처리된다. */
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/** 블록/줄바꿈 경계 — 이 자리엔 공백을 넣어 단어가 붙지 않게 한다. */
const BLOCK_BOUNDARY =
  /<\s*br\s*\/?\s*>|<\s*hr\s*\/?\s*>|<\/\s*(?:p|div|li|ul|ol|h[1-6]|blockquote|pre|tr|td|th)\s*>/gi;

const decodeEntities = (input: string): string =>
  input.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, body: string) => {
    // 숫자 엔티티(&#...) 인지
    const isNumericEntity = body[0] === "#";
    if (isNumericEntity) {
      const code =
        body[1] === "x" || body[1] === "X"
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10);
      return Number.isNaN(code) ? match : String.fromCodePoint(code);
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });

export const htmlToPlainText = (html: string | null | undefined): string => {
  // html 이 비어있는지
  const isHtmlEmpty = !html;
  if (isHtmlEmpty) return "";
  const withBreaks = html.replace(BLOCK_BOUNDARY, " ");
  const withoutTags = withBreaks.replace(/<[^>]*>/g, "");
  // 엔티티 디코드는 태그 제거 뒤에 — 콘텐츠 속 `&lt;` 가 가짜 태그로 재해석되지 않도록.
  const decoded = decodeEntities(withoutTags);
  return decoded.replace(/\s+/g, " ").trim();
};
