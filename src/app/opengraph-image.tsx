import { ImageResponse } from "next/og";

export const alt = "Excelora structured GCSE and A-Level Maths learning workspace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const sidebarItems = ["Laws of Indices", "Surds", "Quadratic Functions"];

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f7f6",
          color: "#18181b",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "54px 62px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: 999,
            right: -180,
            top: -250,
            background: "rgba(24, 24, 27, 0.035)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#18181b",
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              E
            </div>
            <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: 2.4 }}>EXCELORA</div>
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid #d4d4d8",
              borderRadius: 999,
              padding: "9px 16px",
              background: "rgba(255,255,255,0.82)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1.4,
              color: "#52525b",
            }}
          >
            GCSE &amp; A-LEVEL MATHS
          </div>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 52,
            paddingTop: 30,
          }}
        >
          <div style={{ width: 510, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                border: "1px solid #d4d4d8",
                borderRadius: 999,
                padding: "8px 13px",
                background: "#ffffff",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 1.5,
                color: "#52525b",
              }}
            >
              STRUCTURED FOR RESULTS
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 22,
                fontSize: 59,
                lineHeight: 1.02,
                letterSpacing: -2.8,
                fontWeight: 750,
              }}
            >
              <div>Study deeper.</div>
              <div>Learn faster.</div>
            </div>
            <div
              style={{
                marginTop: 21,
                fontSize: 21,
                lineHeight: 1.45,
                color: "#52525b",
                maxWidth: 485,
              }}
            >
              Interactive Maths lessons, expert guidance and measurable progress towards A/A*.
            </div>
          </div>

          <div
            style={{
              width: 520,
              height: 385,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #d4d4d8",
              borderRadius: 24,
              background: "#ffffff",
              boxShadow: "0 24px 70px rgba(24,24,27,0.12)",
            }}
          >
            <div
              style={{
                height: 50,
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                background: "#18181b",
                color: "#ffffff",
              }}
            >
              <div style={{ display: "flex", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: 99, background: "#71717a" }} />
                <div style={{ width: 8, height: 8, borderRadius: 99, background: "#71717a" }} />
                <div style={{ width: 8, height: 8, borderRadius: 99, background: "#71717a" }} />
              </div>
              <div
                style={{
                  marginLeft: 17,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  color: "#d4d4d8",
                }}
              >
                EXCELORA · WORKSPACE
              </div>
            </div>

            <div style={{ flex: 1, display: "flex" }}>
              <div
                style={{
                  width: 165,
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px 16px",
                  borderRight: "1px solid #e4e4e7",
                  background: "#fafafa",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, color: "#a1a1aa" }}>
                  CHAPTER 1
                </div>
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {sidebarItems.map((item, index) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 9,
                        padding: "10px 9px",
                        background: index === 0 ? "#18181b" : "transparent",
                        color: index === 0 ? "#ffffff" : "#71717a",
                        fontSize: 11,
                        fontWeight: index === 0 ? 700 : 500,
                      }}
                    >
                      <div
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 99,
                          marginRight: 8,
                          background: index === 0 ? "#ffffff" : "#d4d4d8",
                        }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "22px 27px",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.3, color: "#a1a1aa" }}>
                  PURE MATHEMATICS
                </div>
                <div
                  style={{
                    height: 31,
                    display: "flex",
                    alignItems: "center",
                    marginTop: 7,
                    fontSize: 23,
                    lineHeight: 1,
                    fontWeight: 750,
                    letterSpacing: -0.6,
                    flexShrink: 0,
                  }}
                >
                  1.1 Laws of Indices
                </div>
                <div
                  style={{
                    height: 164,
                    marginTop: 13,
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #e4e4e7",
                    borderRadius: 13,
                    padding: "14px 19px",
                    background: "#fafafa",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b" }}>THE PRODUCT LAW</div>
                  <div style={{ marginTop: 12, fontSize: 27, fontFamily: "Georgia, serif" }}>
                    a^m × a^n = a^(m+n)
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, lineHeight: 1.4, color: "#71717a" }}>
                    When multiplying powers with the same base, add the indices.
                  </div>
                </div>
                <div style={{ marginTop: 13, display: "flex", alignItems: "center", gap: 9 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#18181b",
                      color: "#ffffff",
                      fontSize: 11,
                    }}
                  >
                    1
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#52525b" }}>
                    Interactive lesson · progress saved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 8,
            color: "#71717a",
            fontSize: 13,
          }}
        >
          <div>Structured teaching · Interactive lessons · Measurable progress</div>
          <div style={{ fontWeight: 700, color: "#18181b" }}>excelora.co.uk</div>
        </div>
      </div>
    ),
    size,
  );
}
