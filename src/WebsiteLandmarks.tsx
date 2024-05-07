const WebsiteLandmarks = ({html}: {html: string}) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const getLandMarks = (doc: Document) => {
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const landmarks = headings.map((heading) => {
      const tagName = heading.tagName
      const level = parseInt(heading.tagName[1])
      const text = heading.textContent
      return {
        tagName,
        level,
        text,
      }
    })

    return landmarks
  }

  const landMarks = getLandMarks(doc)

  return (
    <div>
      <h2>Website Landmarks</h2>
      <div>
        {landMarks.map((landmark) => (
          <>
            <div
              style={{
                marginLeft: landmark.level * 20,
                fontWeight: 'bold',
                color: 'blue',
                fontSize: '1.3em',
              }}
            >
              {landmark.tagName}
            </div>
            <div style={{
              marginLeft: landmark.level * 20,
              color: 'black',
              fontSize: '1.2em',
            }}>{landmark.text}</div>
          </>
        ))}
      </div>
    </div>
  )
}

export default WebsiteLandmarks
