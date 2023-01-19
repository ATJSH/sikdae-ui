import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  SanitizedSikdaeHistory,
  SikdaeHistory,
} from "./modules/sikdae-api/interfaces/hisroty.interface";
import { SANITIZED_SIKDAE_HISTORY_SAMPLE } from "./modules/sikdae-api/sample-data.constant";
import { rawHistoryAtom } from "./status-atom/raw-history.atom";

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const koreanLocaleCurrency = Intl.NumberFormat("ko-KR", {
  currency: "KRW",
  style: "currency",
});

export function App() {
  const [rawHistory, setRawHistory] = useRecoilState(rawHistoryAtom);
  const [sanitizedHistory, setSanitizedHistory] =
    useState<SanitizedSikdaeHistory | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<
    SikdaeHistory["histories"][0] | null
  >(null);

  useEffect(() => {
    setSanitizedHistory(
      rawHistory
        ? {
            amount: rawHistory?.amount,
            histories: rawHistory?.histories.map((history) => ({
              badgeName: history.badgeName,
              useDate: history.useDate + getRandomArbitrary(-100000, 100000),
              state: history.state,
              stateName: history.stateName,
              price: history.price,
              payType: history.payType,
              storeInfo: {
                storeName: history.storeInfo.storeName,
              },
            })),
          }
        : null
    );
  }, [rawHistory]);

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    try {
      if (e.target.value) {
        setRawHistory(JSON.parse(e.target.value));
      }
    } catch (error) {
      console.error(error);
    }
  }

  function setSampleDataOnHistoryState() {
    setRawHistory(SANITIZED_SIKDAE_HISTORY_SAMPLE);
  }

  try {
    return (
      <div>
        <h1>🍋 Sikdae-UI</h1>
        <div>
          <p>
            식권대장 앱 네트워크 트래픽에서 가져온 이용내역 데이터들을 예쁘게
            렌더링해주는 툴.
          </p>
          <button onClick={setSampleDataOnHistoryState}>
            샘플 이력 데이터로 시험해보기
          </button>
        </div>
        <div>
          <h2>사용법</h2>
          <hr />
          <details>
            <summary
              style={{
                cursor: "pointer",
                color: "blue",
              }}
            >
              사용법 확인하기 (접기/펼치기)
            </summary>
            <ol>
              <li>
                Charles Proxy를 컴퓨터에 설치한 후, 핸드폰에 연동시킨다. SSL
                Proxy가 활성화되어 있어야 하고, 모든 도메인에 대해 감청과 해독이
                가능하도록 설정한다.{" "}
                <a href="https://techblog.gccompany.co.kr/charles-proxy-%EC%86%8C%EA%B0%9C-4c4a3bbc8994">
                  요기어때에서 작성한 간단한 사용법
                </a>
              </li>
              <li>
                식권대장 앱을 실행한 후, 메인 - 메뉴 - '결제 내역' 메뉴로
                이동하여 이력을 1회 조회한다.
              </li>
              <li>
                이력을 조회하기 위해 HTTP 요청이 발생했을 것이다. 그 해당 요청은
                cURL 기준으로 아래와 같은 형태일 것이다. 감청 이력을 잘
                찾아보자.
                <div
                  style={{
                    overflowX: "auto",
                    border: "1px solid #eee",
                    padding: "1em",
                  }}
                >
                  <pre>
                    {`curl \\
-H "Host: ***.******.com" \\
-H "content-type: application/json" \\
-H "accept: */*" \\
-H "accept-language: en" \\
-H "responsetype: json" \\
-H "app-session: 167**********.******" \\
-H "authorization: Bearer v********************************************************************" \\
-H "x-sikdae-guid: B6******-****-****-****-5B**********" \\
--compressed \\
"https://***.******.com/account/v3/pointbook?page=1&pageRow=500&searchSupplyType=&searchState=&startDate=2022-12-19&endDate=2023-01-19"`}
                  </pre>
                  * 민감성 정보는 별표로 가려놨다. 일부 헤더값은 생략시켰다.
                </div>
              </li>
              <li>
                쿼리 파라미터 <code>pageRow</code>, <code>startDate</code>와{" "}
                <code>endDate</code>를 가능한 넓은 범위로 지정하여 요청을 날린다
                (API 서버에 부하를 주지 않을 정도로만 상식 선에서 하면 된다.)
              </li>
              <li>
                응답된 데이터를 복사하여 아래 텍스트 에어리어에 붙여넣는다.
              </li>
            </ol>
          </details>
        </div>
        <div>
          <h2>원본 이력 데이터 입력하기</h2>
          <hr />
          <textarea onChange={handleOnChange} />
        </div>
        <br />
        <h1>📊 데이터 분석</h1>
        {rawHistory && (
          <div>
            <h2>통계</h2>
            <hr />
            <ul>
              <li>
                총 사용 금액:{" "}
                {koreanLocaleCurrency.format(rawHistory.amount.totalAmount)}원
              </li>
              <li>총 이용 횟수: {rawHistory.histories.length}회</li>
              <li>
                평균 사용 금액:{" "}
                {koreanLocaleCurrency.format(
                  rawHistory.amount.totalAmount / rawHistory.histories.length
                )}
                원
              </li>
              <li>
                식당별 이용횟수
                <ul>
                  {Object.entries(
                    rawHistory.histories.reduce((acc, cur) => {
                      const storeName = cur.storeInfo.storeName;
                      if (!acc[storeName]) {
                        acc[storeName] = 0;
                      }
                      acc[storeName] += 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([storeName, count]) => (
                      <li key={storeName}>
                        {storeName}: {count}회
                      </li>
                    ))}
                </ul>
              </li>
            </ul>
          </div>
        )}
        <div>
          <h2>Calendar View</h2>
          <hr />
          <div>
            <div
              style={{
                background: "#eee",
                width: "fit-content",
                padding: "0.3em 1em 0.3em 0em",
                margin: "1em 0",
              }}
            >
              {selectedHistory ? (
                <ul>
                  <li>
                    날짜:{" "}
                    {new Date(selectedHistory.useDate).toLocaleString("ko-KR")}
                  </li>
                  <li>식당: {selectedHistory.storeInfo.storeName}</li>
                  <li>결제방식: {selectedHistory.badgeName}</li>
                  <li>
                    결제금액:{" "}
                    {koreanLocaleCurrency.format(selectedHistory.price)}원
                  </li>
                </ul>
              ) : (
                <ul>
                  <li>
                    상세 데이터 보기: 캘린더에서 이력을 클릭하면 상세 데이터를
                    확인할 수 있습니다.
                  </li>
                </ul>
              )}
            </div>
          </div>
          <FullCalendar
            plugins={[listPlugin, dayGridPlugin]}
            initialView="listYear"
            headerToolbar={{
              center: "listYear,dayGridMonth",
            }}
            eventClick={(info) =>
              setSelectedHistory(info.event.extendedProps as any)
            }
            locale={"ko"}
            events={
              rawHistory
                ? rawHistory.histories.map((history) => ({
                    start: new Date(history.useDate),
                    title: `${
                      history.storeInfo.storeName
                    } - ${koreanLocaleCurrency.format(history.price)}`,
                    extendedProps: history,
                  }))
                : []
            }
          />
        </div>
        <div>
          <h2>개인식별정보가 지워진 이력 데이터</h2>
          <hr />
          <button
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(sanitizedHistory));
            }}
          >
            복사
          </button>
          <div
            style={{
              marginTop: "1em",
              overflow: "auto",
              border: "1px solid #eee",
              padding: "1em",
              maxHeight: "50vh",
            }}
          >
            <pre>{JSON.stringify(sanitizedHistory, null, 2)}</pre>
          </div>
        </div>
        <div>
          <h2>Disclaimer</h2>
          <hr />
          <p>
            이 애플리케이션은 개인적인 용도로 만들어졌습니다. 이 애플리케이션은
            식권대장 또는 식권대장의 개발사인 (주)벤디스와는 아무런 관련이
            없으며, 이 애플리에이션을 사용함으로써 발생하는 모든 책임은
            사용자에게 있습니다.
          </p>
        </div>
      </div>
    );
  } catch (error) {
    localStorage.removeItem("rawHistoryAtom");
    return <div>에러가 발생했습니다. 다시 시도해주세요.</div>;
  }
}
