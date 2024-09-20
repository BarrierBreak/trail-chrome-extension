const WebsiteLandmarks = ({ html }: { html: string }) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // To get all landmarks of the webpage
  const getLandMarks = (doc: Document) => {
    const headings = Array.from(
      doc.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]')
    );

    const landmarks = headings.map((heading) => {
      let tagName = heading.tagName;
      let color = "#FEFEFE";
      let bgColor;

      if (
        heading.getAttribute("role") === "heading" &&
        heading.getAttribute("aria-level")
      ) {
        switch (heading.getAttribute("aria-level")) {
          case "1":
            tagName = "H1";
            color = "#19171D";
            bgColor = "#F5BD00";
            break;
          case "2":
            tagName = "H2";
            bgColor = "#5827DA";
            break;
          case "3":
            tagName = "H3";
            bgColor = "#458A46";
            break;
          case "4":
            tagName = "H4";
            bgColor = "#294CB5";
            break;
          case "5":
            tagName = "H5";
            bgColor = "#D20000";
            break;
          case "6":
            tagName = "H6";
            bgColor = "#484453";
            break;
        }
      } else {
        switch (tagName) {
          case "H1":
            color = "#19171D";
            bgColor = "#F5BD00";
            break;
          case "H2":
            bgColor = "#5827DA";
            break;
          case "H3":
            bgColor = "#458A46";
            break;
          case "H4":
            bgColor = "#294CB5";
            break;
          case "H5":
            bgColor = "#D20000";
            break;
          case "H6":
            bgColor = "#484453";
            break;
        }
      }

      return {
        tagName,
        level: parseInt(tagName[1]),
        text: heading.textContent,
        color,
        bgColor,
      };
    });

    return landmarks;
  };

  const landMarks = getLandMarks(doc);

  return (
    <div>
      <div className="pt-4">
        {landMarks.map((landmark) => (
          <>
            <span
              style={{
                color: landmark.color,
                backgroundColor: landmark.bgColor,
                marginLeft: landmark.level * 20,
                padding: "0px 6px",
                borderRadius: "4px",
                fontWeight: "500",
                fontSize: "16px",
              }}
            >
              {landmark.tagName}
            </span>
            <div
              style={{
                margin: "4px 0",
                marginLeft: landmark.level * 20,
                color: "#19171D",
                fontSize: "16px",
              }}
            >
              {landmark.text}
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default WebsiteLandmarks;
