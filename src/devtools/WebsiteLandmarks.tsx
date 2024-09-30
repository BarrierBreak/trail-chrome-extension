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
      <p className="text-base font-semibold text-neutral-900 pb-3">
        Page Structure
      </p>
      {landMarks.map((landmark) => (
        <>
          <span
            className="px-1.5 py-0 rounded font-medium text-base"
            style={{
              color: landmark.color,
              backgroundColor: landmark.bgColor,
              marginLeft: landmark.level * 20 - 20,
            }}
          >
            {landmark.tagName}
          </span>
          <div
            className="mx-0 my-1 text-base text-neutral-900"
            style={{
              marginLeft: landmark.level * 20 - 20,
            }}
          >
            {landmark.text}
          </div>
        </>
      ))}
    </div>
  );
};

export default WebsiteLandmarks;
