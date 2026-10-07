import { describe, expect, test } from "vitest";
import { htmlToPlainText } from "./index.mts";

describe("htmlToPlainText: 엔티티 디코드", () => {
  test("명명 엔티티(&amp; &lt; &gt; &quot; &apos; &nbsp;)를 디코드한다", () => {
    expect(htmlToPlainText("<p>1 &lt; 2 &amp; 3 &gt; 0</p>")).toBe("1 < 2 & 3 > 0");
    expect(htmlToPlainText("<p>&quot;안녕&quot; &apos;하세요&apos;</p>")).toBe(
      '"안녕" \'하세요\'',
    );
    expect(htmlToPlainText("<p>줄&nbsp;바꿈</p>")).toBe("줄 바꿈");
  });

  test("10진 숫자 엔티티(&#65;)를 디코드한다", () => {
    expect(htmlToPlainText("<p>&#65;&#66;&#67;</p>")).toBe("ABC");
  });

  test("16진 숫자 엔티티(&#x41;)를 디코드한다", () => {
    expect(htmlToPlainText("<p>&#x1F600;</p>")).toBe("😀");
  });
});

describe("htmlToPlainText: 목록·블록 태그", () => {
  test("ul/li 항목 사이에 공백을 넣는다", () => {
    const out = htmlToPlainText("<ul><li>하나</li><li>둘</li><li>셋</li></ul>");
    expect(out).toBe("하나 둘 셋");
  });

  test("ol/li 번호 목록도 처리한다", () => {
    const out = htmlToPlainText("<ol><li>첫째</li><li>둘째</li></ol>");
    expect(out).toBe("첫째 둘째");
  });

  test("p 태그 경계에 공백이 생긴다", () => {
    const out = htmlToPlainText("<p>문단 하나</p><p>문단 둘</p>");
    expect(out).toBe("문단 하나 문단 둘");
  });

  test("중첩 블록(blockquote > p)도 경계마다 공백이 생긴다", () => {
    const out = htmlToPlainText("<blockquote><p>인용</p></blockquote>");
    expect(out).toBe("인용");
  });
});

describe("htmlToPlainText: 줄바꿈 태그", () => {
  test("<br>을 공백으로 바꾼다", () => {
    expect(htmlToPlainText("<p>첫 줄<br>둘째 줄</p>")).toBe("첫 줄 둘째 줄");
  });

  test("<br/> 자기닫힘 형식도 처리한다", () => {
    expect(htmlToPlainText("첫 줄<br/>둘째 줄")).toBe("첫 줄 둘째 줄");
  });

  test("<hr>을 공백으로 바꾼다", () => {
    expect(htmlToPlainText("위<hr>아래")).toBe("위 아래");
  });
});

describe("htmlToPlainText: 빈 입력", () => {
  test("null·undefined·빈 문자열은 빈 문자열을 반환한다", () => {
    expect(htmlToPlainText(null)).toBe("");
    expect(htmlToPlainText(undefined)).toBe("");
    expect(htmlToPlainText("")).toBe("");
  });

  test("태그만 있는 HTML은 빈 문자열을 반환한다", () => {
    expect(htmlToPlainText("<p><br/></p>")).toBe("");
  });
});
