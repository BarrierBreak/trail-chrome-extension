;((e) => {
  let n = {unknown: 0, error: 1, warning: 2, notice: 3, pass: 4},
    r = {0: 'unknown', 1: 'error', 2: 'warning', 3: 'notice', 4: 'pass'},
    t = 'color-contrast',
    o = 'Principle1.Guideline14.143.G18.Fail',
    i = 'empty-heading',
    l = 'Principle1.Guideline13.131.H42.2',
    a = 'frame-title',
    c = 'Principle2.Guideline24.241.H64.1',
    u = 'link-name',
    d = 'Principle4.Guideline41.412.H91.A.EmptyNoId',
    s = 'heading-order',
    m = 'Principle1.Guideline13.131A.G141',
    p = new Map([
      [t, [20, o]],
      [o, [20, t]],
      [i, [20, l]],
      [l, [20, i]],
      [a, [10, c]],
      [c, [10, a]],
      [u, [20, d]],
      [d, [20, u]],
      [s, [10, m]],
      [m, [10, s]],
    ]),
    g = null,
    f = null,
    h = (e, t) => {
      let o,
        i = '',
        l = '',
        a = ''
      if (
        e.element &&
        ((i = w(e.element)),
        (l = (function e(n, r = []) {
          if (y(n)) {
            let t = (function (e) {
              if (e.id) return `#${e.id}`
              let n = e.tagName.toLowerCase()
              if (!e.parentNode) return n
              let r = [...e.parentNode.childNodes].filter(y),
                t = r.indexOf(e)
              return (
                r.filter((n) => n.tagName === e.tagName).length <= 1 ||
                  -1 === t ||
                  (n += `:nth-child(${t + 1})`),
                n
              )
            })(n)
            if ((r.unshift(t), !n.id && n.parentNode)) return e(n.parentNode, r)
          }
          return r.join(' > ')
        })(e.element)),
        (a = e.element.tagName ? e.element.tagName.toLowerCase() : ''),
        t && !e.bounds && 'function' == typeof e.element.getBoundingClientRect)
      ) {
        let {
          x: n,
          y: r,
          width: t,
          height: i,
        } = e.element.getBoundingClientRect()
        o = {x: n, y: r, width: t, height: i}
      }
      let c =
        n[
          e.type ||
            (e.value && Array.isArray(e.value) && e.value.length && e.value[0])
        ]
      return {
        context: i || e.snippet,
        selector: l || (e.path && e.path.dom ? e.path.dom : ''),
        elementTagName: a || '',
        code: e.code || e.ruleId,
        type: e.type || r[c],
        typeCode: c || 0,
        message: e.message,
        runner: e.runner ? e.runner : 'scally',
        runnerExtras: e.runnerExtras,
        recurrence: e.recurrence || 0,
        clip: e.bounds
          ? {
              x: e.bounds.left || 0,
              y: e.bounds.top || 0,
              height: e.bounds.height || 0,
              width: e.bounds.width || 0,
            }
          : o,
      }
    },
    w = (e) => e.outerHTML || ''
  function y(e) {
    return e.nodeType === window.Node.ELEMENT_NODE
  }
  let N = async (e) => {
      let n = (n) =>
          !e.ignore.some((e) => e === n.type || e === n.code?.toLowerCase()),
        r = (n) => (
          g || (g = window.document.querySelector(e.rootElement)),
          !g || g.contains(n)
        ),
        t = (n) => {
          f ||
            'string' != typeof e.hideElements ||
            (f = window.document.querySelectorAll(e.hideElements))
          let r = !0
          if (f && f.length) {
            for (let e of ((r = !1), f))
              if (e.contains(n)) {
                r = !0
                break
              }
          }
          return r
        },
        o = (o) =>
          (e.rootElement && !r(o.element)) ||
          (e.hideElements && !t(o.element)) ||
          !n(o) ||
          (o.value &&
            Array.isArray(o.value) &&
            o.value.length >= 2 &&
            'PASS' === o.value[1]),
        i = (n, r, t, i, l) => {
          for (let a of n) {
            if (o(a)) continue
            let n = h(a, e.clip),
              c = 'error' === n.type
            'warning' === n.type && (i.warningCount += n.recurrence + 1),
              'notice' === n.type && (i.noticeCount += n.recurrence + 1)
            let u =
              'W' === n.code[0]
                ? n.code.substring(n.code.indexOf('.') + 1)
                : n.code
            if (p.has(u)) {
              let [e, n] = p.get(u)
              ;(i.accessScore -= e), p.delete(n), p.delete(u)
            }
            if (c && !t.errorPointer) (r[t.ic] = r[0]), (r[0] = n)
            else if (t.errorPointer) {
              let e = r[t.errorPointer]
              e && 'warning' === e.type && c
                ? ((r[t.ic] = e), (r[t.errorPointer] = n))
                : (r[t.ic] = n)
            } else r[t.ic] = n
            c &&
              ((i.errorCount += n.recurrence + 1),
              ('Principle1.Guideline1_1.1_1_1.H37' === n.code ||
                'image-alt' === n.code) &&
                l.push(t.errorPointer),
              t.errorPointer++),
              t.ic++
          }
        },
        l = await Promise.all(
          e.runners.map((n) =>
            P.runners[n](e, P).catch(
              (e) => (e instanceof Error && console.error(e), [])
            )
          )
        ),
        a = {errorCount: 0, warningCount: 0, noticeCount: 0, accessScore: 100},
        c = [],
        u = Array(l.reduce((e, n) => e + n.length, 0)),
        d = {errorPointer: 0, ic: 0}
      for (let e of l) i(e, u, d, a, c)
      return (
        (u.length = d.ic),
        {
          documentTitle: window.document.title,
          pageUrl: window.location.href,
          issues: u,
          meta: a,
          automateable: {missingAltIndexs: c},
        }
      )
    },
    P = (e.__a11y = {run: N, runners: {}})
})(this)
function hr() {
  !(function (e, t) {
    if ('function' == typeof define && define.amd) define('htmlcs', t)
    else if ('object' == typeof a) module.exports = t()
    else {
      var a = t()
      for (var i in a) e[i] = a[i]
    }
  })(this, function () {
    var e = {translation: {}}
    return (
      (e.translation.en = {
        auditor_success_criterion: 'Success Criterion',
        auditor_suggested_techniques: 'Suggested Techniques',
        '1_1_1_H30.2':
          'Img element is the only content of the link, but is missing alt text. The alt text should describe the purpose of the link.',
        '1_1_1_H67.1':
          'Img element with empty alt text must have absent or empty title attribute.',
        '1_1_1_H67.2':
          'Img element is marked so that it is ignored by Assistive Technology.',
        '1_1_1_H37':
          'Img element missing an alt attribute. Use the alt attribute to specify a short text alternative.',
        '1_1_1_G94.Image':
          "Ensure that the img element's alt text serves the same purpose and presents the same information as the image.",
        '1_1_1_H36':
          "Image submit button missing an alt attribute. Specify a text alternative that describes the button's function, using the alt attribute.",
        '1_1_1_G94.Button':
          "Ensure that the image submit button's alt text identifies the purpose of the button.",
        '1_1_1_H24':
          'Area element in an image map missing an alt attribute. Each area element must have a text alternative that describes the function of the image map area.',
        '1_1_1_H24.2':
          "Ensure that the area element's text alternative serves the same purpose as the part of image map image it references.",
        '1_1_1_G73,G74':
          'If this image cannot be fully described in a short text alternative, ensure a long text alternative is also available, such as in the body text or through a link.',
        '1_1_1_H2.EG5':
          'Img element inside a link must not use alt text that duplicates the text content of the link.',
        '1_1_1_H2.EG4':
          'Img element inside a link has empty or missing alt text when a link beside it contains link text. Consider combining the links.',
        '1_1_1_H2.EG3':
          'Img element inside a link must not use alt text that duplicates the content of a text link beside it.',
        '1_1_1_H53,ARIA6':
          'Object elements must contain a text alternative after all other alternatives are exhausted.',
        '1_1_1_G94,G92.Object,ARIA6':
          'Check that short (and if appropriate, long) text alternatives are available for non-text content that serve the same purpose and present the same information.',
        '1_1_1_H35.3':
          "Applet elements must contain a text alternative in the element's body, for browsers without support for the applet element.",
        '1_1_1_H35.2':
          'Applet elements must contain an alt attribute, to provide a text alternative to browsers supporting the element but are unable to load the applet.',
        '1_1_1_G94,G92.Applet':
          'Check that short (and if appropriate, long) text alternatives are available for non-text content that serve the same purpose and present the same information.',
        '1_2_1_G158':
          'If this embedded object contains pre-recorded audio only, and is not provided as an alternative for text content, check that an alternative text version is available.',
        '1_2_1_G159,G166':
          'If this embedded object contains pre-recorded video only, and is not provided as an alternative for text content, check that an alternative text version is available, or an audio track is provided that presents equivalent information.',
        '1_2_2_G87,G93':
          'If this embedded object contains pre-recorded synchronised media and is not provided as an alternative for text content, check that captions are provided for audio content.',
        '1_2_3_G69,G78,G173,G8':
          'If this embedded object contains pre-recorded synchronised media and is not provided as an alternative for text content, check that an audio description of its video, and/or an alternative text version of the content is provided.',
        '1_2_4_G9,G87,G93':
          'If this embedded object contains synchronised media, check that captions are provided for live audio content.',
        '1_2_5_G78,G173,G8':
          'If this embedded object contains pre-recorded synchronised media, check that an audio description is provided for its video content.',
        '1_2_6_G54,G81':
          'If this embedded object contains pre-recorded synchronised media, check that a sign language interpretation is provided for its audio.',
        '1_2_7_G8':
          'If this embedded object contains synchronised media, and where pauses in foreground audio is not sufficient to allow audio descriptions to convey the sense of pre-recorded video, check that an extended audio description is provided, either through scripting or an alternate version.',
        '1_2_8_G69,G159':
          'If this embedded object contains pre-recorded synchronised media or video-only content, check that an alternative text version of the content is provided.',
        '1_2_9_G150,G151,G157':
          'If this embedded object contains live audio-only content, check that an alternative text version of the content is provided.',
        '1_3_1_F92,ARIA4':
          'This element\'s role is "presentation" but contains child elements with semantic meaning.',
        '1_3_1_H44.NonExistent':
          'This label\'s "for" attribute contains an ID that does not exist in the document.',
        '1_3_1_H44.NonExistentFragment':
          'This label\'s "for" attribute contains an ID that does not exist in the document fragment.',
        '1_3_1_H44.NotFormControl':
          'This label\'s "for" attribute contains an ID for an element that is not a form control. Ensure that you have entered the correct ID for the intended element.',
        '1_3_1_H65':
          'This form control has a "title" attribute that is empty or contains only spaces. It will be ignored for labelling test purposes.',
        '1_3_1_ARIA6':
          'This form control has an "aria-label" attribute that is empty or contains only spaces. It will be ignored for labelling test purposes.',
        '1_3_1_ARIA16,ARIA9':
          'This form control contains an aria-labelledby attribute, however it includes an ID "{{id}}" that does not exist on an element. The aria-labelledby attribute will be ignored for labelling test purposes.',
        '1_3_1_F68.Hidden':
          'This hidden form field is labelled in some way. There should be no need to label a hidden form field.',
        '1_3_1_F68.HiddenAttr':
          'This form field is intended to be hidden (using the "hidden" attribute), but is also labelled in some way. There should be no need to label a hidden form field.',
        '1_3_1_F68':
          'This form field should be labelled in some way. Use the label element (either with a "for" attribute or wrapped around the form field), or "title", "aria-label" or "aria-labelledby" attributes as appropriate.',
        '1_3_1_H49.':
          'Presentational markup used that has become obsolete in HTML5.',
        '1_3_1_H49.AlignAttr': 'Align attributes.',
        '1_3_1_H49.Semantic':
          'Semantic markup should be used to mark emphasised or special text so that it can be programmatically determined.',
        '1_3_1_H49.AlignAttr.Semantic':
          'Semantic markup should be used to mark emphasised or special text so that it can be programmatically determined.',
        '1_3_1_H42':
          'Heading markup should be used if this content is intended as a heading.',
        '1_3_1_H63.3':
          'Table cell has an invalid scope attribute. Valid values are row, col, rowgroup, or colgroup.',
        '1_3_1_H63.2':
          'Scope attributes on td elements that act as headings for other elements are obsolete in HTML5. Use a th element instead.',
        '1_3_1_H43.ScopeAmbiguous':
          'Scope attributes on th elements are ambiguous in a table with multiple levels of headings. Use the headers attribute on td elements instead.',
        '1_3_1_H43.IncorrectAttr':
          'Incorrect headers attribute on this td element. Expected "{{expected}}" but found "{{actual}}"',
        '1_3_1_H43.IncorrectAttrNotice':
          'Check that headers attribute on td elements are correct.',
        '1_3_1_H43.HeadersRequired':
          'The relationship between td elements and their associated th elements is not defined. As this table has multiple levels of th elements, you must use the headers attribute on td elements.',
        '1_3_1_H43.MissingHeaderIds':
          "Not all th elements in this table contain an id attribute. These cells should contain ids so that they may be referenced by td elements' headers attributes.",
        '1_3_1_H43.MissingHeadersAttrs':
          'Not all td elements in this table contain a headers attribute. Each headers attribute should list the ids of all th elements associated with that cell.',
        '1_3_1_H43,H63':
          'The relationship between td elements and their associated th elements is not defined. Use either the scope attribute on th elements, or the headers attribute on td elements.',
        '1_3_1_H63.1':
          'Not all th elements in this table have a scope attribute. These cells should contain a scope attribute to identify their association with td elements.',
        '1_3_1_H73.3.LayoutTable':
          'This table appears to be used for layout, but contains a summary attribute. Layout tables must not contain summary attributes, or if supplied, must be empty.',
        '1_3_1_H39,H73.4':
          'If this table is a data table, and both a summary attribute and a caption element are present, the summary should not duplicate the caption.',
        '1_3_1_H73.3.Check':
          "If this table is a data table, check that the summary attribute describes the table's organization or explains how to use the table.",
        '1_3_1_H73.3.NoSummary':
          'If this table is a data table, consider using the summary attribute of the table element to give an overview of this table.',
        '1_3_1_H39.3.LayoutTable':
          'This table appears to be used for layout, but contains a caption element. Layout tables must not contain captions.',
        '1_3_1_H39.3.Check':
          'If this table is a data table, check that the caption element accurately describes this table.',
        '1_3_1_H39.3.NoCaption':
          'If this table is a data table, consider using a caption element to the table element to identify this table.',
        '1_3_1_H71.NoLegend':
          'Fieldset does not contain a legend element. All fieldsets should contain a legend element that describes a description of the field group.',
        '1_3_1_H85.2':
          'If this selection list contains groups of related options, they should be grouped with optgroup.',
        '1_3_1_H71.SameName':
          'If these radio buttons or check boxes require a further group-level description, they should be contained within a fieldset element.',
        '1_3_1_H48.1':
          'This content looks like it is simulating an unordered list using plain text. If so, marking up this content with a ul element would add proper structure information to the document.',
        '1_3_1_H48.2':
          'This content looks like it is simulating an ordered list using plain text. If so, marking up this content with an ol element would add proper structure information to the document.',
        '1_3_1_G141_a':
          'The heading structure is not logically nested. This h{{headingNum}} element appears to be the primary document heading, so should be an h1 element.',
        '1_3_1_G141_b':
          'The heading structure is not logically nested. This h{{headingNum}} element should be an h{{properHeadingNum}} to be properly nested.',
        '1_3_1_H42.2':
          'Heading tag found with no content. Text that is not intended as a heading should not be marked up with heading tags.',
        '1_3_1_H48':
          'If this element contains a navigation section, it is recommended that it be marked up as a list.',
        '1_3_1_LayoutTable':
          'This table appears to be a layout table. If it is meant to instead be a data table, ensure header cells are identified using th elements.',
        '1_3_1_DataTable':
          'This table appears to be a data table. If it is meant to instead be a layout table, ensure there are no th elements, and no summary or caption.',
        '1_3_2_G57':
          'Check that the content is ordered in a meaningful sequence when linearised, such as when style sheets are disabled.',
        '1_3_3_G96':
          'Where instructions are provided for understanding the content, do not rely on sensory characteristics alone (such as shape, size or location) to describe objects.',
        '1_3_4.RestrictView':
          'Check that content does not restrict its view and operation to a single display orientation, such as portrait or landscape, unless a specific display orientation is essential.',
        '1_3_5_H98.FaultyValue':
          'This element contains a potentially faulty value in its autocomplete attribute: {{valuesStr}}.',
        '1_3_5_H98.InvalidAutoComplete_Text':
          'Invalid autocomplete value: {{x}}. Element does not belong to Text control group.',
        '1_3_5_H98.InvalidAutoComplete_Multiline':
          'Invalid autocomplete value: {{x}}. Element does not belong to Multiline control group.',
        '1_3_5_H98.InvalidAutoComplete_Password':
          'Invalid autocomplete value: {{x}}. Element does not belong to Password control group.',
        '1_3_5_H98.InvalidAutoComplete_Url':
          'Invalid autocomplete value: {{x}}. Element does not belong to Url control group.',
        '1_3_5_H98.InvalidAutoComplete_Telephone':
          'Invalid autocomplete value: {{x}}. Element does not belong to Telephone control group.',
        '1_3_5_H98.InvalidAutoComplete_Numeric':
          'Invalid autocomplete value: {{x}}. Element does not belong to Numeric control group.',
        '1_3_5_H98.InvalidAutoComplete_Month':
          'Invalid autocomplete value: {{x}}. Element does not belong to Month control group.',
        '1_3_5_H98.InvalidAutoComplete_Date':
          'Invalid autocomplete value: {{x}}. Element does not belong to Date control group.',
        '1_3_5_H98.Purpose':
          'Check that the input field serves a purpose identified in the Input Purposes for User Interface Components section; and that the content is implemented using technologies with support for identifying the expected meaning for form input data.',
        '1_3_5_H98.MissingAutocomplete':
          'This element does not have an autocomplete attribute. If this field collects information about the user, consider adding one to comply with this Success Criterion.',
        '1_3_6_ARIA11.Check':
          'Check that the purpose of User Interface Components, icons, and regions can be programmatically determined.',
        '1_4_1_G14,G18':
          'Check that any information conveyed using colour alone is also available in text, or through other visual cues.',
        '1_4_2_F23':
          'If this element contains audio that plays automatically for longer than 3 seconds, check that there is the ability to pause, stop or mute the audio.',
        '1_4_3_F24.BGColour':
          'Check that this element has an inherited foreground colour to complement the corresponding inline background colour or image.',
        '1_4_3_F24.FGColour':
          'Check that this element has an inherited background colour or image to complement the corresponding inline foreground colour.',
        '1_4_3_G18_or_G145.Abs':
          'This element is absolutely positioned and the background color can not be determined. Ensure the contrast ratio between the text and all covered parts of the background are at least {{required}}:1.',
        '1_4_3_G18_or_G145.BgImage':
          "This element's text is placed on a background image. Ensure the contrast ratio between the text and all covered parts of the image are at least {{required}}:1.",
        '1_4_3_G18_or_G145.BgGradient':
          "This element's text is placed on a gradient. Ensure the contrast ratio between the text and all covered parts of the gradient are at least {{required}}:1.",
        '1_4_3_G18_or_G145.Alpha':
          "This element's text or background contains transparency. Ensure the contrast ratio between the text and background are at least {{required}}:1.",
        '1_4_3_G18_or_G145.Fail':
          'This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least {{required}}:1, but text in this element has a contrast ratio of {{value}}:1.',
        '1_4_3_G18_or_G145.Fail.Recomendation': 'Recommendation: ',
        '1_4_3_G18_or_G145.Fail.Recomendation.Text':
          'change text colour to {{value}}',
        '1_4_3_G18_or_G145.Fail.Recomendation.Background':
          'change background to {{value}}',
        '1_4_4_G142':
          'Check that text can be resized without assistive technology up to 200 percent without loss of content or functionality.',
        '1_4_5_G140,C22,C30.AALevel':
          "If the technologies being used can achieve the visual presentation, check that text is used to convey information rather than images of text, except when the image of text is essential to the information being conveyed, or can be visually customised to the user's requirements.",
        '1_4_6_G18_or_G17.Abs':
          'This element is absolutely positioned and the background color can not be determined. Ensure the contrast ratio between the text and all covered parts of the background are at least {{required}}:1.',
        '1_4_6_G18_or_G17.BgImage':
          "This element's text is placed on a background image. Ensure the contrast ratio between the text and all covered parts of the image are at least {{required}}:1.",
        '1_4_6_G18_or_G17.BgGradient':
          "This element's text is placed on a background gradient. Ensure the contrast ratio between the text and all covered parts of the gradient are at least {{required}}:1.",
        '1_4_6_G18_or_G17.Fail':
          'This element has insufficient contrast at this conformance level. Expected a contrast ratio of at least {{required}}:1, but text in this element has a contrast ratio of {{value}}:1.',
        '1_4_6_G18_or_G17.Fail.Recomendation': 'Recommendation: ',
        '1_4_6_G18_or_G17.Fail.Recomendation.Text':
          'change text colour to {{value}}',
        '1_4_6_G18_or_G17.Fail.Recomendation.Background':
          'change background to {{value}}',
        '1_4_7_G56':
          'For pre-recorded audio-only content in this element that is primarily speech (such as narration), any background sounds should be muteable, or be at least 20 dB (or about 4 times) quieter than the speech.',
        '1_4_8_G148,G156,G175':
          'Check that a mechanism is available for the user to select foreground and background colours for blocks of text, either through the Web page or the browser.',
        '1_4_8_H87,C20':
          'Check that a mechanism exists to reduce the width of a block of text to no more than 80 characters (or 40 in Chinese, Japanese or Korean script).',
        '1_4_8_C19,G172,G169':
          'Check that blocks of text are not fully justified - that is, to both left and right edges - or a mechanism exists to remove full justification.',
        '1_4_8_G188,C21':
          'Check that line spacing in blocks of text are at least 150% in paragraphs, and paragraph spacing is at least 1.5 times the line spacing, or that a mechanism is available to achieve this.',
        '1_4_8_H87,G146,C26':
          'Check that text can be resized without assistive technology up to 200 percent without requiring the user to scroll horizontally on a full-screen window.',
        '1_4_9_G140,C22,C30.NoException':
          'Check that images of text are only used for pure decoration or where a particular presentation of text is essential to the information being conveyed.',
        '1_4_10_C32,C31,C33,C38,SCR34,G206.Check':
          'Check that content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions for:     Vertical scrolling content at a width equivalent to 320 CSS pixels;     Horizontal scrolling content at a height equivalent to 256 CSS pixels;     Except for parts of the content which require two-dimensional layout for usage or meaning.',
        '1_4_10_C32,C31,C33,C38,SCR34,G206.Fixed':
          'This element has "position: fixed". This may require scrolling in two dimensions, which is considered a failure of this Success Criterion.',
        '1_4_10_C32,C31,C33,C38,SCR34,G206.Scrolling':
          'Preformatted text may require scrolling in two dimensions, which is considered a failure of this Success Criterion.',
        '1_4_10_C32,C31,C33,C38,SCR34,G206.Zoom':
          "Interfering with a user agent's ability to zoom may be a failure of this Success Criterion.",
        '1_4_11_G195,G207,G18,G145,G174,F78.Check':
          'Check that the visual presentation of the following have a contrast ratio of at least 3:1 against adjacent color(s):     User Interface Components: Visual information required to identify user interface components and states, except for inactive components or where the appearance of the component is determined by the user agent and not modified by the author;     Graphical Objects: Parts of graphics required to understand the content, except when a particular presentation of graphics is essential to the information being conveyed.',
        '1_4_12_C36,C35.Check':
          'Check that no loss of content or functionality occurs by setting all of the following and by changing no other style property:              Line height (line spacing) to at least 1.5 times the font size;         Spacing following paragraphs to at least 2 times the font size;         Letter spacing (tracking) to at least 0.12 times the font size;         Word spacing to at least 0.16 times the font size.',
        '1_4_13_F95.Check':
          'Check that where receiving and then removing pointer hover or keyboard focus triggers additional content to become visible and then hidden, the following are true:         Dismissable: A mechanism is available to dismiss the additional content without moving pointer hover or keyboard focus, unless the additional content communicates an input error or does not obscure or replace other content;         Hoverable: If pointer hover can trigger the additional content, then the pointer can be moved over the additional content without the additional content disappearing;         Persistent: The additional content remains visible until the hover or focus trigger is removed, the user dismisses it, or its information is no longer valid.',
        '2_1_1_G90':
          'Ensure the functionality provided by an event handler for this element is available through the keyboard',
        '2_1_1_SCR20.DblClick':
          'Ensure the functionality provided by double-clicking on this element is available through the keyboard.',
        '2_1_1_SCR20.MouseOver':
          'Ensure the functionality provided by mousing over this element is available through the keyboard; for instance, using the focus event.',
        '2_1_1_SCR20.MouseOut':
          'Ensure the functionality provided by mousing out of this element is available through the keyboard; for instance, using the blur event.',
        '2_1_1_SCR20.MouseMove':
          'Ensure the functionality provided by moving the mouse on this element is available through the keyboard.',
        '2_1_1_SCR20.MouseDown':
          'Ensure the functionality provided by mousing down on this element is available through the keyboard; for instance, using the keydown event.',
        '2_1_1_SCR20.MouseUp':
          'Ensure the functionality provided by mousing up on this element is available through the keyboard; for instance, using the keyup event.',
        '2_1_2_F10':
          'Check that this applet or plugin provides the ability to move the focus away from itself when using the keyboard.',
        '2_1_4.Check':
          'Check that if a keyboard shortcut is implemented in content using only letter (including upper- and lower-case letters), punctuation, number, or symbol characters, then at least one of the following is true:              Turn off: A mechanism is available to turn the shortcut off;         Remap: A mechanism is available to remap the shortcut to use one or more non-printable keyboard characters (e.g. Ctrl, Alt, etc);         Active only on focus: The keyboard shortcut for a user interface component is only active when that component has focus.     ',
        '2_2_1_F40.2':
          'Meta refresh tag used to redirect to another page, with a time limit that is not zero. Users cannot control this time limit.',
        '2_2_1_F41.2':
          'Meta refresh tag used to refresh the current page. Users cannot control the time limit for this refresh.',
        '2_2_2_SCR33,SCR22,G187,G152,G186,G191':
          'If any part of the content moves, scrolls or blinks for more than 5 seconds, or auto-updates, check that there is a mechanism available to pause, stop, or hide the content.',
        '2_2_2_F4':
          'Ensure there is a mechanism available to stop this blinking element in less than five seconds.',
        '2_2_2_F47':
          'Blink elements cannot satisfy the requirement that blinking information can be stopped within five seconds.',
        '2_2_3_G5':
          'Check that timing is not an essential part of the event or activity presented by the content, except for non-interactive synchronized media and real-time events.',
        '2_2_4_SCR14':
          'Check that all interruptions (including updates to content) can be postponed or suppressed by the user, except interruptions involving an emergency.',
        '2_2_5_G105,G181':
          'If this Web page is part of a set of Web pages with an inactivity time limit, check that an authenticated user can continue the activity without loss of data after re-authenticating.',
        '2_2_6.Check':
          'Check that users are warned of the duration of any user inactivity that could cause data loss, unless the data is preserved for more than 20 hours when the user does not take any actions.',
        '2_3_1_G19,G176':
          'Check that no component of the content flashes more than three times in any 1-second period, or that the size of any flashing area is sufficiently small.',
        '2_3_2_G19':
          'Check that no component of the content flashes more than three times in any 1-second period.',
        '2_3_3.Check':
          'Check that motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed.',
        '2_4_1_H64.1':
          'Iframe element requires a non-empty title attribute that identifies the frame.',
        '2_4_1_H64.2':
          'Check that the title attribute of this element contains text that identifies the frame.',
        '2_4_1_G1,G123,G124,H69':
          'Ensure that any common navigation elements can be bypassed; for instance, by use of skip links, header elements, or ARIA landmark roles.',
        '2_4_1_G1,G123,G124.NoSuchID':
          'This link points to a named anchor "{{id}}" within the document, but no anchor exists with that name.',
        '2_4_1_G1,G123,G124.NoSuchIDFragment':
          'This link points to a named anchor "{{id}}" within the document, but no anchor exists with that name in the fragment tested.',
        '2_4_2_H25.1.NoHeadEl':
          'There is no head section in which to place a descriptive title element.',
        '2_4_2_H25.1.NoTitleEl':
          'A title should be provided for the document, using a non-empty title element in the head section.',
        '2_4_2_H25.1.EmptyTitle':
          'The title element in the head section should be non-empty.',
        '2_4_2_H25.2': 'Check that the title element describes the document.',
        '2_4_3_H4.2':
          'If tabindex is used, check that the tab order specified by the tabindex attributes follows relationships in the content.',
        '2_4_4_H77,H78,H79,H80,H81,H33':
          'Check that the link text combined with programmatically determined link context, or its title attribute, identifies the purpose of the link.',
        '2_4_4_H77,H78,H79,H80,H81':
          'Check that the link text combined with programmatically determined link context identifies the purpose of the link.',
        '2_4_5_G125,G64,G63,G161,G126,G185':
          'If this Web page is not part of a linear process, check that there is more than one way of locating this Web page within a set of Web pages.',
        '2_4_6_G130,G131':
          'Check that headings and labels describe topic or purpose.',
        '2_4_7_G149,G165,G195,C15,SCR31':
          'Check that there is at least one mode of operation where the keyboard focus indicator can be visually located on user interface controls.',
        '2_4_8_H59.1':
          'Link elements can only be located in the head section of the document.',
        '2_4_8_H59.2a':
          'Link element is missing a non-empty rel attribute identifying the link type.',
        '2_4_8_H59.2b':
          'Link element is missing a non-empty href attribute pointing to the resource being linked.',
        '2_4_9_H30':
          'Check that text of the link describes the purpose of the link.',
        '2_5_1.Check':
          'Check that all functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture, unless a multipoint or path-based gesture is essential.',
        '2_5_2.SinglePointer_Check':
          'Check that for functionality that can be operated using a single pointer, at least one of the following is true:         No Down-Event: The down-event of the pointer is not used to execute any part of the function;         Abort or Undo: Completion of the function is on the up-event, and a mechanism is available to abort the function before completion or to undo the function after completion;         Up Reversal: The up-event reverses any outcome of the preceding down-event;         Essential: Completing the function on the down-event is essential.',
        '2_5_2.Mousedown_Check':
          'This element has an mousedown event listener. Check that for functionality that can be operated using a single pointer, at least one of the following is true:         No Down-Event: The down-event of the pointer is not used to execute any part of the function;         Abort or Undo: Completion of the function is on the up-event, and a mechanism is available to abort the function before completion or to undo the function after completion;         Up Reversal: The up-event reverses any outcome of the preceding down-event;         Essential: Completing the function on the down-event is essential.',
        '2_5_2.Touchstart_Check':
          'This element has a touchstart event listener. Check that for functionality that can be operated using a single pointer, at least one of the following is true:              No Down-Event: The down-event of the pointer is not used to execute any part of the function;         Abort or Undo: Completion of the function is on the up-event, and a mechanism is available to abort the function before completion or to undo the function after completion;         Up Reversal: The up-event reverses any outcome of the preceding down-event;         Essential: Completing the function on the down-event is essential.',
        '2_5_3_F96.Check':
          'Check that for user interface components with labels that include text or images of text, the name contains the text that is presented visually.',
        '2_5_3_F96.AccessibleName':
          'Accessible name for this element does not contain the visible label text. Check that for user interface components with labels that include text or images of text, the name contains the text that is presented visually.',
        '2_5_4.Check':
          'Check that functionality that can be operated by device motion or user motion can also be operated by user interface components and responding to the motion can be disabled to prevent accidental actuation, except when:              Supported Interface: The motion is used to operate functionality through an accessibility supported interface;         Essential: The motion is essential for the function and doing so would invalidate the activity.     ',
        '2_5_4.Devicemotion':
          'This element has a devicemotion event listener. Check that functionality that can be operated by device motion or user motion can also be operated by user interface components and responding to the motion can be disabled to prevent accidental actuation, except when:              Supported Interface: The motion is used to operate functionality through an accessibility supported interface;         Essential: The motion is essential for the function and doing so would invalidate the activity.     ',
        '2_5_5.Check':
          'Check that the size of the target for pointer inputs is at least 44 by 44 CSS pixels except when:              Equivalent: The target is available through an equivalent link or control on the same page that is at least 44 by 44 CSS pixels;         Inline: The target is in a sentence or block of text;         User Agent Control: The size of the target is determined by the user agent and is not modified by the author;         Essential: A particular presentation of the target is essential to the information being conveyed.     ',
        '2_5_6.Check':
          'Check that the content does not restrict use of input modalities available on a platform except where the restriction is essential, required to ensure the security of the content, or required to respect user settings.',
        '3_1_1_H57.2':
          'The html element should have a lang or xml:lang attribute which describes the language of the document.',
        '3_1_1_H57.3.Lang':
          'The language specified in the lang attribute of the document element does not appear to be well-formed.',
        '3_1_1_H57.3.XmlLang':
          'The language specified in the xml:lang attribute of the document element does not appear to be well-formed.',
        '3_1_2_H58':
          'Ensure that any change in language is marked using the lang and/or xml:lang attribute on an element, as appropriate.',
        '3_1_2_H58.1.Lang':
          'The language specified in the lang attribute of this element does not appear to be well-formed.',
        '3_1_2_H58.1.XmlLang':
          'The language specified in the xml:lang attribute of this element does not appear to be well-formed.',
        '3_1_3_H40,H54,H60,G62,G70':
          'Check that there is a mechanism available for identifying specific definitions of words or phrases used in an unusual or restricted way, including idioms and jargon.',
        '3_1_4_G102,G55,G62,H28,G97':
          'Check that a mechanism for identifying the expanded form or meaning of abbreviations is available.',
        '3_1_5_G86,G103,G79,G153,G160':
          'Where the content requires reading ability more advanced than the lower secondary education level, supplemental content or an alternative version should be provided.',
        '3_1_6_H62.1.HTML5':
          'Ruby element does not contain an rt element containing pronunciation information for its body text.',
        '3_1_6_H62.1.XHTML11':
          'Ruby element does not contain an rt element containing pronunciation information for the text inside the rb element.',
        '3_1_6_H62.2':
          'Ruby element does not contain rp elements, which provide extra punctuation to browsers not supporting ruby text.',
        '3_2_1_G107':
          'Check that a change of context does not occur when this input field receives focus.',
        '3_2_2_H32.2':
          'This form does not contain a submit button, which creates issues for those who cannot submit the form using the keyboard. Submit buttons are INPUT elements with type attribute "submit" or "image", or BUTTON elements with type "submit" or omitted/invalid.',
        '3_2_3_G61':
          'Check that navigational mechanisms that are repeated on multiple Web pages occur in the same relative order each time they are repeated, unless a change is initiated by the user.',
        '3_2_4_G197':
          'Check that components that have the same functionality within this Web page are identified consistently in the set of Web pages to which it belongs.',
        '3_2_5_H83.3':
          "Check that this link's link text contains information indicating that the link will open in a new window.",
        '3_3_1_G83,G84,G85':
          'If an input error is automatically detected in this form, check that the item(s) in error are identified and the error(s) are described to the user in text.',
        '3_3_2_G131,G89,G184,H90':
          'Check that descriptive labels or instructions (including for required fields) are provided for user input in this form.',
        '3_3_3_G177':
          'Check that this form provides suggested corrections to errors in user input, unless it would jeopardize the security or purpose of the content.',
        '3_3_4_G98,G99,G155,G164,G168.LegalForms':
          'If this form would bind a user to a financial or legal commitment, modify/delete user-controllable data, or submit test responses, ensure that submissions are either reversible, checked for input errors, and/or confirmed by the user.',
        '3_3_5_G71,G184,G193':
          'Check that context-sensitive help is available for this form, at a Web-page and/or control level.',
        '3_3_6_G98,G99,G155,G164,G168.AllForms':
          'Check that submissions to this form are either reversible, checked for input errors, and/or confirmed by the user.',
        '4_1_2_H91.A.Empty':
          'Anchor element found with an ID but without a href or link text. Consider moving its ID to a parent or nearby element.',
        '4_1_2_H91.A.EmptyWithName':
          'Anchor element found with a name attribute but without a href or link text. Consider moving the name attribute to become an ID of a parent or nearby element.',
        '4_1_2_H91.A.EmptyNoId':
          'Anchor element found with no link content and no name and/or ID attribute.',
        '4_1_2_H91.A.NoHref':
          'Anchor elements should not be used for defining in-page link targets. If not using the ID for other purposes (such as CSS or scripting), consider moving it to a parent element.',
        '4_1_2_H91.A.Placeholder':
          'Anchor element found with link content, but no href, ID or name attribute has been supplied.',
        '4_1_2_H91.A.NoContent':
          'Anchor element found with a valid href attribute, but no link content has been supplied.',
        '4_1_2_input_element': 'input element',
        '4_1_2_element_content': 'element content',
        '4_1_2_element': 'element',
        '4_1_2_msg_pattern':
          'This {{msgNodeType}} does not have a name available to an accessibility API. Valid names are: {{builtAttrs}}.',
        '4_1_2_msg_pattern_role_of_button':
          'This element has role of "button" but does not have a name available to an accessibility API. Valid names are: {{builtAttrs}}.',
        '4_1_2_msg_pattern2':
          'This {{msgNodeType}} does not have a value available to an accessibility API.',
        '4_1_2_msg_add_one': 'Add one by adding content to the element.',
        '4_1_2_msg_pattern3':
          'This {{msgNodeType}} does not have an initially selected option. Depending on your HTML version, the value exposed to an accessibility API may be undefined.',
        '4_1_2_value_exposed_using_attribute':
          'A value is exposed using the {{requiredValue}} attribute.',
        '4_1_2_value_exposed_using_element':
          'A value is exposed using the {{requiredValue}} element.',
        '4_1_3_ARIA22,G199,ARIA19,G83,G84,G85,G139,G177,G194,ARIA23.Check':
          'Check that status messages can be programmatically determined through role or properties such that they can be presented to the user by assistive technologies without receiving focus.',
      }),
      (e.HTMLCS_Section508 = {
        name: 'Section508',
        description: 'U.S. Section 508 Standard',
        sniffs: [
          'A',
          'B',
          'C',
          'D',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
        ],
      }),
      (e.HTMLCS_Section508_Sniffs_A = {
        get register() {
          return ['_top', 'img', 'object', 'bgsound', 'audio']
        },
        process: function (e, t) {
          e === t
            ? (this.addNullAltTextResults(t),
              this.addMediaAlternativesResults(t))
            : ('OBJECT' !== (t = e.nodeName) &&
                'BGSOUND' !== t &&
                'AUDIO' !== t) ||
              HTMLCS.addMessage(
                HTMLCS.NOTICE,
                e,
                'For multimedia containing audio only, ensure an alternative is available, such as a full text transcript.',
                'Audio'
              )
        },
        testNullAltText: function (e) {
          var t = {
            img: {
              generalAlt: [],
              missingAlt: [],
              ignored: [],
              nullAltWithTitle: [],
              emptyAltInLink: [],
            },
            inputImage: {generalAlt: [], missingAlt: []},
            area: {generalAlt: [], missingAlt: []},
          }
          for (let n of HTMLCS.util.getAllElements(
            e,
            'img, area, input[type="image"]'
          )) {
            let e = !1,
              s = !1,
              r = !1
            if ('A' === n.parentNode.nodeName) {
              var a = HTMLCS.util.getPreviousSiblingElement(n, null),
                i = HTMLCS.util.getNextSiblingElement(n, null)
              if (null === a && null === i) {
                let t = n.parentNode.textContent
                ;(t =
                  void 0 !== n.parentNode.textContent
                    ? n.parentNode.textContent
                    : n.parentNode.innerText),
                  !0 === HTMLCS.util.isStringEmpty(t) && (e = !0)
              }
            }
            switch (
              (!1 === n.hasAttribute('alt')
                ? (s = !0)
                : (n.getAttribute('alt') &&
                    !0 !== HTMLCS.util.isStringEmpty(n.getAttribute('alt'))) ||
                  (r = !0),
              n.nodeName)
            ) {
              case 'IMG':
                !0 !== e || (!0 !== s && !0 !== r)
                  ? (!0 === s
                      ? t.img.missingAlt
                      : !0 === r
                      ? !0 === n.hasAttribute('title') &&
                        !1 ===
                          HTMLCS.util.isStringEmpty(n.getAttribute('title'))
                        ? t.img.nullAltWithTitle
                        : t.img.ignored
                      : t.img.generalAlt
                    ).push(n)
                  : t.img.emptyAltInLink.push(n.parentNode)
                break
              case 'INPUT':
                ;(!0 === s || !0 === r
                  ? t.inputImage.missingAlt
                  : t.inputImage.generalAlt
                ).push(n)
                break
              case 'AREA':
                ;(!0 === s || !0 === r
                  ? t.area.missingAlt
                  : t.inputImage.generalAlt
                ).push(n)
            }
          }
          return t
        },
        addNullAltTextResults: function (e) {
          for (let t of (e = this.testNullAltText(e)).img.emptyAltInLink)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'Img element is the only content of the link, but is missing alt text. The alt text should describe the purpose of the link.',
              'Img.EmptyAltInLink'
            )
          for (let t of e.img.nullAltWithTitle)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'Img element with empty alt text must have absent or empty title attribute.',
              'Img.NullAltWithTitle'
            )
          for (let t of e.img.ignored)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Img element is marked so that it is ignored by Assistive Technology.',
              'Img.Ignored'
            )
          for (let t of e.img.missingAlt)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'Img element missing an alt attribute. Use the alt attribute to specify a short text alternative.',
              'Img.MissingAlt'
            )
          for (let t of e.img.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              "Ensure that the img element's alt text serves the same purpose and presents the same information as the image.",
              'Img.GeneralAlt'
            )
          for (let t of e.inputImage.missingAlt)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              "Image submit button missing an alt attribute. Specify a text alternative that describes the button's function, using the alt attribute.",
              'InputImage.MissingAlt'
            )
          for (let t of e.inputImage.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              "Ensure that the image submit button's alt text identifies the purpose of the button.",
              'InputImage.GeneralAlt'
            )
          for (let t of e.area.missingAlt)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'Area element in an image map missing an alt attribute. Each area element must have a text alternative that describes the function of the image map area.',
              'Area.MissingAlt'
            )
          for (let t of e.area.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              "Ensure that the area element's text alternative serves the same purpose as the part of image map image it references.",
              'Area.GeneralAlt'
            )
        },
        testMediaTextAlternatives: function (e) {
          var t = {
            object: {missingBody: [], generalAlt: []},
            applet: {missingBody: [], missingAlt: [], generalAlt: []},
          }
          for (let a of HTMLCS.util.getAllElements(e, 'object'))
            null === a.querySelector('object') &&
              ('' === HTMLCS.util.getElementTextContent(a, !0)
                ? t.object.missingBody
                : t.object.generalAlt
              ).push(a)
          for (let i of HTMLCS.util.getAllElements(e, 'applet')) {
            let e = !1
            null === i.querySelector('object') &&
              ((a = HTMLCS.util.getElementTextContent(i, !0)),
              !0 === HTMLCS.util.isStringEmpty(a)) &&
              (t.applet.missingBody.push(i), (e = !0))
            var a = i.getAttribute('alt') || ''
            HTMLCS.util.isStringEmpty(a) &&
              (t.applet.missingAlt.push(i), (e = !0)),
              e || t.applet.generalAlt.push(i)
          }
          return t
        },
        addMediaAlternativesResults: function (e) {
          for (let t of (e =
            HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_1_1_1_1.testMediaTextAlternatives(
              e
            )).object.missingBody)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'Object elements must contain a text alternative after all other alternatives are exhausted.',
              'Object.MissingBody'
            )
          for (let t of e.object.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              'Check that short (and if appropriate, long) text alternatives are available for non-text content that serve the same purpose and present the same information.',
              'Object.GeneralAlt'
            )
          for (let t of e.applet.missingBody)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              "Applet elements must contain a text alternative in the element's body, for browsers without support for the applet element.",
              'Applet.MissingBody'
            )
          for (let t of e.applet.missingAlt)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'Applet elements must contain an alt attribute, to provide a text alternative to browsers supporting the element but are unable to load the applet.',
              'Applet.MissingAlt'
            )
          for (let t of e.applet.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              'Check that short (and if appropriate, long) text alternatives are available for non-text content that serve the same purpose and present the same information.',
              'Applet.GeneralAlt'
            )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_B = {
        get register() {
          return ['object', 'applet', 'embed', 'video']
        },
        process: (e, t) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            e,
            'For multimedia containing video, ensure a synchronised audio description or text alternative for the video portion is provided.',
            'Video'
          ),
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              e,
              'For multimedia containing synchronised audio and video, ensure synchronised captions are provided for the audio portion.',
              'Captions'
            )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_C = {
        get register() {
          return ['_top']
        },
        process: (e, t) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            'Ensure that any information conveyed using colour alone is also available without colour, such as through context or markup.',
            'Colour'
          )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_D = {
        get register() {
          return ['_top']
        },
        process: function (t, a) {
          t === a &&
            (HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              'Ensure that content is ordered in a meaningful sequence when linearised, such as when style sheets are disabled.',
              'Linearised'
            ),
            e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_1.testPresentationMarkup(
              a
            ),
            this.testHeadingOrder(a),
            HTMLCS.util.getAllElements(a, 'script, link[rel="stylesheet"]')
              .length) &&
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              'If content is hidden and made visible using scripting (such as "click to expand" sections), ensure this content is readable when scripts and style sheets are disabled.',
              'HiddenText'
            )
        },
        testHeadingOrder: function (e) {
          let t = 0
          for (let i of HTMLCS.util.getAllElements(
            e,
            'h1, h2, h3, h4, h5, h6'
          )) {
            var a = parseInt(i.nodeName.substring(1, 2))
            if (1 < a - t) {
              let e = 'should be an h' + (t + 1) + ' to be properly nested'
              0 === t &&
                (e =
                  'appears to be the primary document heading, so should be an h1 element'),
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  i,
                  'The heading structure is not logically nested. This h' +
                    a +
                    ' element ' +
                    e +
                    '.',
                  'HeadingOrder'
                )
            }
            t = a
          }
        },
      }),
      (e.HTMLCS_Section508_Sniffs_G = {
        get register() {
          return ['table']
        },
        process: (e, t) => {
          HTMLCS.util.isLayoutTable(e) &&
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              e,
              'This table has no headers. If this is a data table, ensure row and column headers are identified using th elements.',
              'TableHeaders'
            )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_H = {
        get register() {
          return ['table']
        },
        process: (e, t) => {
          var a = HTMLCS.util.testTableHeaders(e)
          for (let e of a.wrongHeaders)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              e.element,
              'Incorrect headers attribute on this td element. Expected "' +
                e.expected +
                '" but found "' +
                e.actual +
                '"',
              'IncorrectHeadersAttr'
            )
          a.required &&
            !a.allowScope &&
            (a.used
              ? (0 < a.missingThId.length &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    e,
                    "Not all th elements in this table contain an id attribute. These cells should contain ids so that they may be referenced by td elements' headers attributes.",
                    'MissingHeaderIds'
                  ),
                0 < a.missingTd.length &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    e,
                    'Not all td elements in this table contain a headers attribute. Each headers attribute should list the ids of all th elements associated with that cell.',
                    'IncompleteHeadersAttrs'
                  ))
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  e,
                  'The relationship between td elements and their associated th elements is not defined. As this table has multiple levels of th elements, you must use the headers attribute on td elements.',
                  'MissingHeadersAttrs'
                ))
        },
      }),
      (e.HTMLCS_Section508_Sniffs_I = {
        get register() {
          return ['frame', 'iframe', 'object']
        },
        process: (e, t) => {
          var a = e.nodeName.toLowerCase()
          !0 ===
            (e.hasAttribute('title') &&
              HTMLCS.util.isStringEmpty(e.getAttribute('title'))) &&
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'This ' +
                a +
                ' element is missing title text. Frames should be titled with text that facilitates frame identification and navigation.',
              'Frames'
            )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_J = {
        get register() {
          return ['_top']
        },
        process: (e, t) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            'Check that no component of the content flickers at a rate of greater than 2 and less than 55 times per second.',
            'Flicker'
          )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_K = {
        get register() {
          return ['_top']
        },
        process: (e, t) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            "If this page cannot be made compliant, a text-only page with equivalent information or functionality should be provided. The alternative page needs to be updated in line with this page's content.",
            'AltVersion'
          )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_L = {
        get register() {
          return ['_top']
        },
        process: function (e, t) {
          e === t && (this.addProcessLinksMessages(t), this.testKeyboard(t))
        },
        addProcessLinksMessages: function (e) {
          for (let t of (e = this.processLinks(e)).emptyNoId)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'Anchor element found with no link content and no name and/or ID attribute.',
              'EmptyAnchorNoId'
            )
          for (let t of e.placeholder)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Anchor element found with link content, but no href, ID, or name attribute has been supplied.',
              'PlaceholderAnchor'
            )
          for (let t of e.noContent)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'Anchor element found with a valid href attribute, but no link content has been supplied.',
              'NoContentAnchor'
            )
        },
        processLinks: function (e) {
          var t = {
            empty: [],
            emptyWithName: [],
            emptyNoId: [],
            noHref: [],
            placeholder: [],
            noContent: [],
          }
          for (let i of HTMLCS.util.getAllElements(e, 'a')) {
            var a = HTMLCS.util.getElementTextContent(i)
            let e = !1
            !1 ===
            (e =
              (!0 === i.hasAttribute('href') &&
                !1 === /^\s*$/.test(i.getAttribute('href'))) ||
              e)
              ? (!0 === /^\s*$/.test(a)
                  ? i.hasAttribute('id')
                    ? t.empty
                    : i.hasAttribute('name')
                    ? t.emptyWithName
                    : t.emptyNoId
                  : i.hasAttribute('id') || i.hasAttribute('name')
                  ? t.noHref
                  : t.placeholder
                ).push(i)
              : !0 === /^\s*$/.test(a) &&
                0 === i.querySelectorAll('img').length &&
                t.noContent.push(i)
          }
          return t
        },
        testKeyboard: function (e) {
          for (let t of HTMLCS.util.getAllElements(e, '*[ondblclick]'))
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Ensure the functionality provided by double-clicking on this element is available through the keyboard.',
              'DblClick'
            )
          for (let t of HTMLCS.util.getAllElements(e, '*[onmouseover]'))
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Ensure the functionality provided by mousing over this element is available through the keyboard; for instance, using the focus event.',
              'MouseOver'
            )
          for (let t of HTMLCS.util.getAllElements(e, '*[onmouseout]'))
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Ensure the functionality provided by mousing out of this element is available through the keyboard; for instance, using the blur event.',
              'MouseOut'
            )
          for (let t of HTMLCS.util.getAllElements(e, '*[onmousemove]'))
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Ensure the functionality provided by moving the mouse on this element is available through the keyboard.',
              'MouseMove'
            )
          for (let t of HTMLCS.util.getAllElements(e, '*[onmousedown]'))
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Ensure the functionality provided by mousing down on this element is available through the keyboard; for instance, using the keydown event.',
              'MouseDown'
            )
          for (let t of HTMLCS.util.getAllElements(e, '*[onmouseup]'))
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Ensure the functionality provided by mousing up on this element is available through the keyboard; for instance, using the keyup event.',
              'MouseUp'
            )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_M = {
        get register() {
          return ['object', 'applet', 'bgsound', 'embed', 'audio', 'video']
        },
        process: (e, t) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            e,
            'If external media requires a plugin or application to view, ensure a link is provided to a plugin or application that complies with Section 508 accessibility requirements for applications.',
            'PluginLink'
          )
        },
      }),
      (e.HTMLCS_Section508_Sniffs_N = {
        get register() {
          return ['form']
        },
        process: (e, t) => {
          'FORM' === e.nodeName &&
            (HTMLCS.addMessage(
              HTMLCS.NOTICE,
              e,
              'If an input error is automatically detected in this form, check that the item(s) in error are identified and the error(s) are described to the user in text.',
              'Errors'
            ),
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              e,
              'Check that descriptive labels or instructions (including for required fields) are provided for user input in this form.',
              'Labels'
            ),
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              e,
              'Ensure that this form can be navigated using the keyboard and other accessibility tools.',
              'KeyboardNav'
            ))
        },
      }),
      (e.HTMLCS_Section508_Sniffs_O = {
        get register() {
          return ['_top', 'a', 'area']
        },
        process: (e, t) => {
          if (e === t)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              'Ensure that any common navigation elements can be bypassed; for instance, by use of skip links, header elements, or ARIA landmark roles.',
              'SkipLinks'
            )
          else if (e.hasAttribute('href')) {
            var a = e.getAttribute('href').trim()
            if (1 < a.length && '#' === a.charAt(0)) {
              a = a.substring(1)
              try {
                let i = t,
                  n = (i.ownerDocument && (i = i.ownerDocument), null)
                ;(null !==
                  (n =
                    i &&
                    'function' == typeof i.getElementById &&
                    null === (n = i.getElementById(a))
                      ? i.querySelector('a[name="' + a + '"]')
                      : n) &&
                  !1 !== HTMLCS.util.contains(t, n)) ||
                  (!0 === HTMLCS.isFullDoc(t) || 'BODY' === t.nodeName
                    ? HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        e,
                        'This link points to a named anchor "' +
                          a +
                          '" within the document, but no anchor exists with that name.',
                        'NoSuchID'
                      )
                    : HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        e,
                        'This link points to a named anchor "' +
                          a +
                          '" within the document, but no anchor exists with that name in the fragment tested.',
                        'NoSuchIDFragment'
                      ))
              } catch (e) {}
            }
          }
        },
      }),
      (e.HTMLCS_Section508_Sniffs_P = {
        get register() {
          return ['_top', 'meta']
        },
        process: (e, t) => {
          e === t
            ? HTMLCS.addMessage(
                HTMLCS.NOTICE,
                t,
                'If a timed response is required on this page, alert the user and provide sufficient time to allow them to indicate that more time is required.',
                'TimeLimit'
              )
            : !0 === e.hasAttribute('http-equiv') &&
              'refresh' ===
                String(e.getAttribute('http-equiv')).toLowerCase() &&
              !0 ===
                /^[1-9]\d*/.test(e.getAttribute('content').toLowerCase()) &&
              (!0 === /url=/.test(e.getAttribute('content').toLowerCase())
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    e,
                    'Meta refresh tag used to redirect to another page, with a time limit that is not zero. Users cannot control this time limit.',
                    'MetaRedirect'
                  )
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    e,
                    'Meta refresh tag used to refresh the current page. Users cannot control the time limit for this refresh.',
                    'MetaRefresh'
                  ))
        },
      }),
      (e.HTMLCS_SectionBB = {
        name: 'SectionBB',
        description: 'Custom Rules by BarrierBreak',
        sniffs: [
          {
            standard: 'SectionBB',
            include: [
              'Canvas',
              'Img',
              'Svg',
              'ImgBtn',
              'ImgIcon',
              'ImgLinks',
              'Audio',
              'Video',
              'Title',
              'Iframe',
              'Headings',
              'Landmark',
              'Lists',
              'Universal',
              'Language',
              'Native',
              'SkipLinks',
              'Dialog',
            ],
          },
        ],
      }),
      (e.HTMLCS_SectionBB_Sniffs_Audio = {
        get register() {
          return ['_top', 'audio']
        },
        process: function (e) {
          for (let t of HTMLCS.util.getUniversalElements(e, 'audio'))
            this.checkAudioTag(t)
        },
        checkAudioTag: function (t) {
          var a
          t.hasAttribute('aria-hidden') &&
          'true' === t.getAttribute('aria-hidden')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-hidden'),
                'BB10336'
              )
            : (a = HTMLCS.util.getElementTextContent(document.body)).includes(
                'transcript'
              ) || a.includes('Transcript')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                'Has a Transcript.',
                'BB10316'
              )
            : HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                'Transcript Not Found',
                'BB10317'
              )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Canvas = {
        get register() {
          return ['_top', 'canvas']
        },
        process: function (e, t) {
          this.validateCanvasTag(t)
        },
        validateCanvasTag: function (e) {
          for (let t of HTMLCS.util.getUniversalElements(e, 'canvas')) {
            let e = !1
            0 < HTMLCS.util.getTextContent(t).trim().length && (e = !0),
              (t.hasAttribute('role') &&
                'presentation' === t.getAttribute('role')) ||
              (t.hasAttribute('role') && 'none' === t.getAttribute('role')) ||
              (t.hasAttribute('aria-hidden') &&
                'true' === t.getAttribute('aria-hidden'))
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    'Hidden from Accessibility Tree',
                    'BB10306'
                  )
                : 'img' == t.getAttribute('role')
                ? this.checkCanvasAriaConditions(t, e)
                : e
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    'Has Text Content',
                    'BB10301'
                  )
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    'No Text Content',
                    'BB10300'
                  )
          }
        },
        checkCanvasAriaConditions: function (t, a) {
          t.hasAttribute('aria-label')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-label'),
                'BB10301'
              )
            : t.hasAttribute('aria-labelledby') ||
              t.hasAttribute('aria-describedby')
            ? HTMLCS.util.hasValidLabelId(t)
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                  'BB10301'
                )
              : HTMLCS.addMessage(HTMLCS.ERROR, t, 'Missing ID', 'BB10302')
            : a
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t),
                'BB10301'
              )
            : HTMLCS.addMessage(HTMLCS.ERROR, t, 'No Text Content', 'BB10303')
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_CSSBackground = {
        testCSSBackground: function (e) {
          var t = []
          for (
            e.ownerDocumnet
              ? t.push(e)
              : (e = e.getElementsByTagName('body')).length && t.push(e[0]);
            0 < t.length;

          ) {
            var a = t.shift()
            HTMLCS.util.style(a, ':before') &&
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                a,
                'Ensure that the CSS background is not used to convey content.',
                'CSSBackground'
              )
          }
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Dialog = {
        get register() {
          return ['_top', 'dialog']
        },
        process: function (e) {
          for (let t of HTMLCS.util.getUniversalElements(e, 'dialog'))
            this.checkDialog(t)
        },
        checkDialog: function (t) {
          'presentation' === t.getAttribute('role') &&
          'none' === t.getAttribute('role') &&
          'true' === t.getAttribute('aria-hidden')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                'Hidden from accessibility tree',
                'BB10616'
              )
            : t.hasAttribute('aria-label')
            ? '' === t.getAttribute('aria-label').trim()
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-label'),
                  'BB10618'
                )
              : HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-label'),
                  'BB10617'
                )
            : t.hasAttribute('aria-labelledby')
            ? HTMLCS.util.hasValidLabelId(t)
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                  'BB10617'
                )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'No Associate ID found',
                  'BB10302'
                )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'Missing aria-labelledby',
                'BB10619'
              )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Headings = {
        get register() {
          return ['_top', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        },
        process: (t, a) => {
          var i = HTMLCS.util.getUniversalElements(
              a,
              'h1, h2, h3, h4, h5, h6,[role="heading"]'
            ),
            n = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
            s = []
          let r = 1
          if (0 < i.length)
            for (let t of i)
              if (
                'none' === HTMLCS.util.style(t)?.display ||
                'presentation' === t.getAttribute('role') ||
                'none' === t.getAttribute('role') ||
                'true' === t.getAttribute('aria-hidden')
              )
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'role'),
                  'BB10325'
                )
              else {
                n.includes(t.nodeName) &&
                  'heading' === t.getAttribute('role') &&
                  !t.hasAttribute('aria-level') &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getAttribute(t, 'role'),
                    'BB10408'
                  ),
                  0 === HTMLCS.util.getTextContent(t).trim().length &&
                    HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      e.HTMLCS.getAttribute(t),
                      'BB10402'
                    ),
                  12 <
                    HTMLCS.util.getTextContent(t).trim().split(/\s+/).length &&
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      t,
                      e.HTMLCS.getAttribute(t),
                      'BB10569'
                    ),
                  ('H1' !== t.nodeName &&
                    '1' !== t.getAttribute('aria-level')) ||
                    s.push(t)
                let a = parseInt(t.nodeName.substring(1)),
                  i = 'H'
                'heading' === t.getAttribute('role') &&
                  t.hasAttribute('aria-level') &&
                  ((i = 'Aria-Level='),
                  (a = parseInt(t.getAttribute('aria-level'))))
                var l = a
                if (1 < l - r) {
                  let e = ''
                  for (let t = l - 1; t > r; t--) e += t + ','
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    '{{missingheadingtext}}{{properHeadingNum}} Missing'
                      .replace(
                        /\{\{properHeadingNum\}\}/g,
                        e.replace(/,\s*$/, '') + ''
                      )
                      .replace(/\{\{missingheadingtext\}\}/g, i + ''),
                    'BB10405'
                  )
                } else
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    'Check Heading Structure',
                    'BB10406'
                  )
                r = l
              }
          if (t === a) {
            if (0 === i.length)
              HTMLCS.addMessage(HTMLCS.ERROR, t, 'No Headings found', 'BB10014')
            else
              switch (s.length) {
                case 0:
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    'H1 is not found',
                    'BB10447'
                  )
                  break
                case 1:
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    s[0],
                    'Check H1 Heading',
                    'BB10404'
                  ),
                    HTMLCS.addMessage(
                      HTMLCS.PASS,
                      s[0],
                      'H1 Headings Present',
                      'BB10622'
                    )
                  break
                default:
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    s[0],
                    'Multiple H1 Headings',
                    'BB10403'
                  ),
                    HTMLCS.addMessage(
                      HTMLCS.PASS,
                      s[0],
                      'H1 Headings Present',
                      'BB10622'
                    )
              }
            e.HTMLCS_SectionBB_Sniffs_Universal.checkHeadings(a)
          }
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Iframe = {
        get register() {
          return ['_top', 'iframe']
        },
        process: (t, a) => {
          for (let t of HTMLCS.util.getUniversalElements(a, 'iframe'))
            if ('trail-iframe' !== t.getAttribute('id')) {
              var i = HTMLCS.util.style(t),
                n = i?.display,
                i = i?.visibility
              let s = !1,
                r = !0,
                l = !1
              t.hasAttribute('title') &&
                ((s = !0), 0 < t.getAttribute('title').trim().length) &&
                (r = !1),
                t.hasAttribute('aria-label') && (l = !0),
                (t.hasAttribute('role') &&
                  'presentation' === t.getAttribute('role')) ||
                (t.hasAttribute('role') && 'none' === t.getAttribute('role')) ||
                (t.hasAttribute('aria-hidden') &&
                  'true' === t.getAttribute('aria-hidden')) ||
                (t.hasAttribute('tabindex') &&
                  '-1' === t.getAttribute('tabindex')) ||
                'none' === n ||
                'hidden' === i
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      t,
                      e.HTMLCS.getAttribute(t, 'role,aria-hidden,tabindex', !0),
                      'BB10342'
                    )
                  : t.hasAttribute('aria-labelledby') ||
                    t.hasAttribute('aria-describedby')
                  ? HTMLCS.util.hasValidLabelId(t)
                    ? 1 ===
                      e.HTMLCS_SectionBB_Sniffs_Iframe.checkMultipleName(
                        a,
                        t,
                        'aria-labelledby'
                      )
                      ? HTMLCS.addMessage(
                          HTMLCS.WARNING,
                          t,
                          e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                          'BB10343'
                        )
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          t,
                          e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                          'BB10513'
                        )
                    : HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        'Missing ID',
                        'BB10302'
                      )
                  : l
                  ? 0 ===
                    e.HTMLCS_SectionBB_Sniffs_Iframe.checkMultipleName(
                      a,
                      t,
                      'aria-label'
                    )
                    ? HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        t,
                        'No Duplicate Aria Label Found',
                        'BB10343'
                      )
                    : HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        'Duplicate Aria Label Found',
                        'BB10513'
                      )
                  : s
                  ? r
                    ? HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        'Blank Title Attribute',
                        'BB10345'
                      )
                    : 0 ===
                      e.HTMLCS_SectionBB_Sniffs_Iframe.checkMultipleName(
                        a,
                        t,
                        'title'
                      )
                    ? HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        t,
                        'No Duplicate Title Found',
                        'BB10343'
                      )
                    : HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        'Duplicate Title Found',
                        'BB10513'
                      )
                  : HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      'No Title Attribute',
                      'BB10344'
                    )
            }
        },
        checkMultipleName: function (e, t, a) {
          var i
          let n = 0,
            s = null
          for (let r of ('aria-label' == a || 'text' == a
            ? (s = t.getAttribute(a))
            : ((t = t.getAttribute(a)),
              (a = document.getElementById(t)) &&
                (s = HTMLCS.util.getElementTextContent(a))),
          HTMLCS.util.getUniversalElements(e, 'iframe')))
            r.hasAttribute('aria-labelledby')
              ? ((i = r.getAttribute('aria-labelledby')),
                (i = document.getElementById(i)),
                HTMLCS.util.getElementTextContent(i) === s && n++)
              : r.hasAttribute('aria-label')
              ? r.getAttribute('aria-label') === s && n++
              : r.hasAttribute('title') && r.getAttribute('title') === s && n++
          return n
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Img = {
        get register() {
          return ['_top', 'img']
        },
        process: function (e) {
          for (let t of HTMLCS.util.getUniversalElements(e, 'img')) {
            let e = !1,
              a = t.parentElement
            for (
              let t = 0;
              t < 20 && 'body' !== a.nodeName.toLowerCase();
              t++
            ) {
              if (
                'button' === a.nodeName.toLowerCase() ||
                'a' === a.nodeName.toLowerCase()
              ) {
                e = !0
                break
              }
              a = a.parentElement
            }
            e || this.checkImgHasParent(t)
          }
        },
        testImgElement: function (e, t) {
          this.checkImgHasParent(e, t)
        },
        checkImgHasParent: function (t, a = null) {
          var i,
            a = null !== a ? a : t
          ;(t.hasAttribute('role') &&
            'presentation' === t.getAttribute('role')) ||
          (t.hasAttribute('role') && 'none' === t.getAttribute('role')) ||
          (t.hasAttribute('aria-hidden') &&
            'true' === t.getAttribute('aria-hidden'))
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                a,
                'Hidden from Accessibility Tree',
                'BB10306'
              )
            : t.hasAttribute('aria-label')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                a,
                e.HTMLCS.getAttribute(a, 'aria-label'),
                'BB10301'
              )
            : t.hasAttribute('aria-labelledby') ||
              t.hasAttribute('aria-describedby')
            ? HTMLCS.util.hasValidLabelId(t)
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  a,
                  e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                  'BB10301'
                )
              : HTMLCS.addMessage(HTMLCS.ERROR, a, 'Missing ID', 'BB10302')
            : t.hasAttribute('alt')
            ? 0 === (i = t.getAttribute('alt')).length
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  a,
                  'Empty alt Attribute',
                  'BB10304'
                )
              : /^\s*$/.test(i)
              ? HTMLCS.addMessage(HTMLCS.ERROR, a, 'Empty Alt', 'BB10305')
              : i.length &&
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  a,
                  e.HTMLCS.getAttribute(t, 'alt'),
                  'BB10301'
                )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                a,
                'alt Attribute Missing',
                'BB10324'
              )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_ImgBtn = {
        get register() {
          return ['_top', 'button']
        },
        process: function (e, t) {
          this.validateImgBtnTag(t)
        },
        validateImgBtnTag: function (t) {
          for (let s of HTMLCS.util.getUniversalElements(
            t,
            'button,input[type="image"]'
          )) {
            var a = []
            for (let e of HTMLCS.util.getUniversalElements(s, '*')) a.push(e)
            let t = '',
              r = !1,
              l = !1,
              o = !1,
              d = !1,
              u = null
            var i,
              n = null
            let g = !1
            'BUTTON' === s.nodeName &&
              (s.hasAttribute('title') && (l = !0), 0 < a.length) &&
              a.forEach((e) => {
                1 === e.nodeType &&
                  (('svg' !== e.nodeName.toLowerCase() &&
                    'img' !== e.nodeName.toLowerCase() &&
                    'i' !== e.nodeName.toLowerCase()) ||
                    ((t = e.nodeName.toLowerCase()), (u = e)),
                  ('div' !== e.nodeName.toLowerCase() &&
                    'span' !== e.nodeName.toLowerCase() &&
                    'p' !== e.nodeName.toLowerCase()) ||
                    (0 < HTMLCS.util.getTextContent(e).trim().length &&
                      (g = !0)))
              }),
              'input' === s.nodeName.toLowerCase() &&
                s.hasAttribute('type') &&
                'image' === s.getAttribute('type') &&
                ((r = !0),
                s.hasAttribute('alt') && (o = !0),
                s.hasAttribute('title') && (d = !0),
                (n = s)),
              '' !== t
                ? (s.hasAttribute('tabindex') &&
                    '-1' === s.getAttribute('tabindex')) ||
                  (s.hasAttribute('aria-hidden') &&
                    'true' === s.getAttribute('aria-hidden'))
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      s,
                      e.HTMLCS.getAttribute(s, 'tabindex,aria-hidden', !0),
                      'BB10310'
                    )
                  : this.checkImgBtnAriaConditions(s, l, t, u, g)
                : r &&
                  ((n.hasAttribute('tabindex') &&
                    '-1' === n.getAttribute('tabindex')) ||
                  (n.hasAttribute('aria-hidden') &&
                    'true' === n.getAttribute('aria-hidden'))
                    ? HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        n,
                        e.HTMLCS.getAttribute(n, 'title'),
                        'BB10310'
                      )
                    : (o
                        ? d &&
                          HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            n,
                            e.HTMLCS.getAttribute(n, 'title'),
                            'BB10301'
                          )
                        : 0 === (i = n.getAttribute('alt'))?.length
                        ? HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            n,
                            'Empty Alt Attribute',
                            'BB10304'
                          )
                        : /^\s*$/.test(i)
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            n,
                            'Blank Alt Attribute',
                            'BB10305'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            n,
                            e.HTMLCS.getAttribute(s, 'alt'),
                            'BB10301'
                          ),
                      this.checkInputImgBtnAriaConditions(s, d, o, n)))
          }
        },
        checkInputImgBtnAriaConditions: function (t, a, i, n) {
          n.hasAttribute('aria-label')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                n,
                e.HTMLCS.getAttribute(n, 'aria-label'),
                'BB10301'
              )
            : n.hasAttribute('aria-labelledby') ||
              n.hasAttribute('aria-describedby')
            ? HTMLCS.util.hasValidLabelId(n)
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  n,
                  e.HTMLCS.getAttribute(n, 'aria-labelledby'),
                  'BB10301'
                )
              : a || i
              ? HTMLCS.addMessage(HTMLCS.ERROR, n, 'Missing ID', 'BB10302')
              : HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  n,
                  e.HTMLCS.getAttribute(n, 'title'),
                  'BB10301'
                )
            : a || i
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                n,
                e.HTMLCS.getAttribute(n, 'alt'),
                'BB10301'
              )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                n,
                'No Title or Alt Attribute',
                'BB10314'
              )
        },
        checkImgBtnAriaConditions: function (t, a, i, n, s) {
          if (t.hasAttribute('aria-label'))
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              e.HTMLCS.getAttribute(t, 'aria-label'),
              'BB10301'
            )
          else if (
            t.hasAttribute('aria-labelledby') ||
            t.hasAttribute('aria-describedby')
          )
            HTMLCS.util.hasValidLabelId(t)
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                  'BB10301'
                )
              : HTMLCS.addMessage(HTMLCS.ERROR, t, 'Missing ID', 'BB10302')
          else if (a || s)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              e.HTMLCS.getAttribute(t, 'title'),
              'BB10301'
            )
          else
            switch (i) {
              case 'i':
                e.HTMLCS_SectionBB_Sniffs_ImgIcon.validateImgIcon(n, t)
                break
              case 'svg':
                e.HTMLCS_SectionBB_Sniffs_Svg.validateSvgTag(n, t)
                break
              case 'img':
                e.HTMLCS_SectionBB_Sniffs_Img.testImgElement(n, t)
            }
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_ImgIcon = {
        get register() {
          return ['_top', 'i']
        },
        process: function (e, t) {
          for (let e of HTMLCS.util.getUniversalElements(t, 'i')) {
            let t = !1,
              a = e.parentElement
            for (
              let e = 0;
              e < 20 && 'body' !== a.nodeName.toLowerCase();
              e++
            ) {
              if (
                'button' === a.nodeName.toLowerCase() ||
                'a' === a.nodeName.toLowerCase()
              ) {
                t = !0
                break
              }
              a = a.parentElement
            }
            t || this.checkIconImgHasParent(e)
          }
        },
        validateImgIcon: function (e, t) {
          this.checkIconImgHasParent(e, t)
        },
        checkIconImgHasParent: function (t, a = null) {
          ;(a = null !== a ? a : t),
            t.hasAttribute('aria-hidden') &&
            'true' === t.getAttribute('aria-hidden')
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  a,
                  e.HTMLCS.getAttribute(a, 'aria-hidden'),
                  'BB10306'
                )
              : t.hasAttribute('role') && 'img' === t.getAttribute('role')
              ? t.hasAttribute('aria-label')
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    a,
                    e.HTMLCS.getAttribute(a, 'aria-label'),
                    'BB10301'
                  )
                : t.hasAttribute('aria-labelledby') ||
                  (t.hasAttribute('aria-describedby') &&
                    !/^\s*$/.test(t.getAttribute('aria-labelledby')) &&
                    !/^\s*$/.test(t.getAttribute('aria-describedby')))
                ? HTMLCS.util.hasValidLabelId(t)
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                      'BB10301'
                    )
                  : HTMLCS.addMessage(HTMLCS.ERROR, a, 'Missing ID', 'BB10302')
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    a,
                    'No Textual Description',
                    'BB10312'
                  )
              : HTMLCS.addMessage(HTMLCS.WARNING, a, 'Check Image', 'BB10306')
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_ImgLinks = {
        get register() {
          return ['_top', 'a']
        },
        process: function (e, t) {
          this.validateImgATag(t)
        },
        validateImgATag: function (t) {
          HTMLCS.util.getUniversalElements(t, 'a').forEach((t) => {
            var a = []
            for (let e of HTMLCS.util.getUniversalElements(t, '*')) a.push(e)
            let i = ''
            var n,
              s,
              r = t.hasAttribute('title')
            let l = null,
              o = !1
            0 < a.length &&
              a.forEach((e) => {
                1 === e.nodeType &&
                  (('svg' !== e.nodeName.toLowerCase() &&
                    'img' !== e.nodeName.toLowerCase() &&
                    'i' !== e.nodeName.toLowerCase()) ||
                    ((i = e.nodeName.toLowerCase()), (l = e)),
                  ('div' !== e.nodeName.toLowerCase() &&
                    'span' !== e.nodeName.toLowerCase() &&
                    'p' !== e.nodeName.toLowerCase()) ||
                    (0 < HTMLCS.util.getTextContent(e).trim().length &&
                      (o = !0)))
              }),
              '' !== i &&
                ((n = '-1' === t.getAttribute('tabindex')),
                (s = 'true' === t.getAttribute('aria-hidden')),
                n || s
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      t,
                      e.HTMLCS.getAttribute(t, 'aria-hidden,tabindex', !0),
                      'BB10313'
                    )
                  : this.checkImgLinkAriaConditions(t, r, i, l, o))
          })
        },
        checkImgLinkAriaConditions: function (t, a, i, n, s) {
          if (t.hasAttribute('aria-label'))
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              e.HTMLCS.getAttribute(t, 'aria-label'),
              'BB10301'
            )
          else if (
            t.hasAttribute('aria-labelledby') ||
            t.hasAttribute('aria-describedby')
          )
            HTMLCS.util.hasValidLabelId(t)
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                  'BB10301'
                )
              : HTMLCS.addMessage(HTMLCS.ERROR, t, 'Missing ID', 'BB10302')
          else if (a || s)
            HTMLCS.addMessage(HTMLCS.WARNING, t, a || s, 'BB10301')
          else
            switch (i) {
              case 'i':
                e.HTMLCS_SectionBB_Sniffs_ImgIcon.validateImgIcon(n, t)
                break
              case 'svg':
                e.HTMLCS_SectionBB_Sniffs_Svg.validateSvgTag(n, t)
                break
              case 'img':
                e.HTMLCS_SectionBB_Sniffs_Img.testImgElement(n, t)
            }
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Landmark = {
        get register() {
          return ['_top', 'header', 'footer', 'main', 'form', 'aside', 'nav']
        },
        process: function (e, t) {
          var a = [],
            i = [],
            n = [],
            s = [],
            r = [],
            l = []
          for (let e of HTMLCS.util.getUniversalElements(t, 'form')) s.push(e)
          for (let e of HTMLCS.util.getUniversalElements(t, 'header')) a.push(e)
          for (let e of HTMLCS.util.getUniversalElements(t, 'main')) n.push(e)
          for (let e of HTMLCS.util.getUniversalElements(t, 'nav')) l.push(e)
          for (let e of HTMLCS.util.getUniversalElements(t, 'aside')) r.push(e)
          for (let e of HTMLCS.util.getUniversalElements(t, 'body *'))
            if (e.hasAttribute('role'))
              switch (e.getAttribute('role')) {
                case 'banner':
                  a.push(e)
                  break
                case 'contentinfo':
                  i.push(e)
                  break
                case 'main':
                  n.push(e)
                  break
                case 'navigation':
                  l.push(e)
                  break
                case 'form':
                  s.push(e)
                  break
                case 'complementary':
                  r.push(e)
              }
          this.headerBannerCheck(a),
            this.footerContentCheck(i),
            0 === n.length
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  e,
                  'No Main Tags Found',
                  'BB10393'
                )
              : this.mainMainCheck(n),
            this.formCheck(s),
            this.asideCheck(r),
            this.checkNavTags(l)
        },
        headerBannerCheck: function (t) {
          let a = 0
          0 < t.length &&
            (t.forEach((e) => {
              'true' !== e.getAttribute('aria-hidden') && a++
            }),
            t.forEach((i) => {
              let n = !1,
                s = !1
              var r = HTMLCS.util.style(i)?.display
              i.hasAttribute('aria-label') &&
                ((s = !0), '' === i.getAttribute('aria-label').trim()) &&
                (n = !0),
                'none' === r ||
                'true' === i.getAttribute('aria-hidden') ||
                'presentation' === i.getAttribute('role') ||
                'none' === i.getAttribute('role')
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-hidden,role', !0),
                      'BB10350'
                    )
                  : i.hasAttribute('aria-labelledby')
                  ? 1 < a
                    ? HTMLCS.util.hasValidLabelId(i)
                      ? 1 <
                        (r =
                          0 +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-labelledby'
                          ))
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10516'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10353'
                          )
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'Missing ID',
                          'BB10302'
                        )
                    : (HTMLCS.addMessage(
                        HTMLCS.NOTICE,
                        i,
                        e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                        'BB10463'
                      ),
                      HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        i,
                        'Check the validity of the header Landmark',
                        'BB10351'
                      ))
                  : 1 < a
                  ? (HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check the validity of the header Landmark',
                      'BB10351'
                    ),
                    n
                      ? HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          e.HTMLCS.getAttribute(i, 'aria-label'),
                          'BB10464'
                        )
                      : s
                      ? 1 <
                        (r =
                          0 +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-label'
                          ))
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-label'),
                            'BB10516'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-label'),
                            'BB10468'
                          )
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'Missing aria-label',
                          'BB10354'
                        ))
                  : n
                  ? (HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10462'
                    ),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check the validity of the header Landmark',
                      'BB10351'
                    ))
                  : s
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10353'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check the validity of the header Landmark',
                      'BB10351'
                    )
            }))
        },
        footerContentCheck: function (t) {
          let a = 0
          0 < t.length &&
            (t.forEach((e) => {
              'true' !== e.getAttribute('aria-hidden') && a++
            }),
            t.forEach((i) => {
              let n = !1,
                s = !1
              var r = HTMLCS.util.style(i)?.display
              i.hasAttribute('aria-label') &&
                ((s = !0), '' === i.getAttribute('aria-label').trim()) &&
                (n = !0),
                'none' === r ||
                'true' === i.getAttribute('aria-hidden') ||
                'presentation' === i.getAttribute('role') ||
                'none' === i.getAttribute('role')
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-hidden,role', !0),
                      'BB10465'
                    )
                  : i.hasAttribute('aria-labelledby')
                  ? 1 < a
                    ? HTMLCS.util.hasValidLabelId(i)
                      ? 1 <
                        (r =
                          0 +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-labelledby'
                          ))
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10517'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10467'
                          )
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'Missing ID',
                          'BB10302'
                        )
                    : (HTMLCS.addMessage(
                        HTMLCS.NOTICE,
                        i,
                        e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                        'BB10466'
                      ),
                      HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        i,
                        'Check the validity of the Footer Landmark',
                        'BB10473'
                      ))
                  : 1 < a
                  ? (HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check the validity of the Footer Landmark',
                      'BB10473'
                    ),
                    n
                      ? HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          e.HTMLCS.getAttribute(i, 'aria-label'),
                          'BB10470'
                        )
                      : s
                      ? 1 <
                        (r =
                          0 +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-label'
                          ))
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-label'),
                            'BB10517'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-label'),
                            'BB10469'
                          )
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'aria-label missing',
                          'BB10471'
                        ))
                  : n
                  ? (HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10472'
                    ),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check the validity of the Footer Landmark',
                      'BB10473'
                    ))
                  : s
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10467'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check the validity of the Footer Landmark',
                      'BB10473'
                    )
            }))
        },
        mainMainCheck: function (t) {
          let a = 0
          0 < t.length &&
            (t.forEach((e) => {
              'true' !== e.getAttribute('aria-hidden') && a++
            }),
            t.forEach((i) => {
              let n = !1,
                s = !1
              var r = HTMLCS.util.style(i)?.display
              i.hasAttribute('aria-label') &&
                ((s = !0), '' === i.getAttribute('aria-label').trim()) &&
                (n = !0),
                'none' === r ||
                'true' === i.getAttribute('aria-hidden') ||
                'presentation' === i.getAttribute('role') ||
                'none' === i.getAttribute('role')
                  ? HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-hidden,role', !0),
                      'BB10393'
                    )
                  : i.hasAttribute('aria-labelledby')
                  ? 1 < a
                    ? HTMLCS.util.hasValidLabelId(i)
                      ? 1 <
                        (r =
                          0 +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-labelledby'
                          ))
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10518'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            'aria-labelledby missing',
                            'BB10474'
                          )
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'Missing ID',
                          'BB10302'
                        )
                    : (HTMLCS.addMessage(
                        HTMLCS.NOTICE,
                        i,
                        e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                        'BB10480'
                      ),
                      HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        i,
                        'Check Main Landmark',
                        'BB10476'
                      ))
                  : 1 < a
                  ? (HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check Main Landmark',
                      'BB10476'
                    ),
                    n
                      ? HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          e.HTMLCS.getAttribute(i, 'aria-label'),
                          'BB10399'
                        )
                      : s
                      ? 1 <
                        (r =
                          0 +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-label'
                          ))
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-label'),
                            'BB10518'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-label'),
                            'BB10477'
                          )
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'aria-label missing',
                          'BB10399'
                        ))
                  : n
                  ? (HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10475'
                    ),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check Main Landmark',
                      'BB10476'
                    ))
                  : s
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10474'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check Main Landmark',
                      'BB10476'
                    )
            }))
        },
        formCheck: function (t) {
          if (0 < t.length) {
            let a = 0
            t.forEach((e) => {
              var t = HTMLCS.util.style(e)
              'none' !== t?.display &&
                'hidden' !== t.visibility &&
                'true' !== e.getAttribute('aria-hidden') &&
                'presentation' !== e.getAttribute('role') &&
                'none' !== e.getAttribute('role') &&
                a++
            }),
              t.forEach((i) => {
                var n = HTMLCS.util.style(i)
                'none' === n?.display ||
                'hidden' === n.visibility ||
                'true' === i.getAttribute('aria-hidden') ||
                'presentation' === i.getAttribute('role') ||
                'none' === i.getAttribute('role')
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-hidden,role', !0),
                      'BB10502'
                    )
                  : 1 < a
                  ? i.hasAttribute('aria-label')
                    ? i.hasAttribute('aria-labelledby')
                      ? i.hasAttribute('aria-labelledby')
                        ? HTMLCS.util.hasValidLabelId(i) ||
                          (i.hasAttribute('aria-label')
                            ? this.checkFormBlankAria(i, t)
                            : HTMLCS.addMessage(
                                HTMLCS.ERROR,
                                i,
                                'Missing ID',
                                'BB10302'
                              ))
                        : (HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            'aria-labelledby missing',
                            'BB10507'
                          ),
                          HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            'Check Form Landmark',
                            'BB10508'
                          ))
                      : this.checkFormBlankAria(i, t)
                    : i.hasAttribute('aria-labelledby')
                    ? HTMLCS.util.hasValidLabelId(i)
                      ? 1 <
                        (n =
                          (n =
                            (n =
                              0 +
                              e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                                t,
                                i,
                                'aria-label'
                              )) +
                            e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                              t,
                              i,
                              'aria-labelledby'
                            )) +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'title'
                          ))
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10520'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10505'
                          )
                      : i.hasAttribute('aria-label')
                      ? this.checkFormBlankAria(i, t)
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'Missing ID',
                          'BB10302'
                        )
                    : (HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        i,
                        'Missing accessible name',
                        'BB10507'
                      ),
                      HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        i,
                        'Check Form Landmark',
                        'BB10508'
                      ))
                  : i.hasAttribute('aria-label')
                  ? HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10503'
                    )
                  : i.hasAttribute('aria-labelledby')
                  ? HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                      'BB10504'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check Form Landmark',
                      'BB10508'
                    )
              })
          }
        },
        asideCheck: function (t) {
          0 < t.length &&
            t.forEach((a) => {
              var i = HTMLCS.util.style(a)
              'none' === i?.display ||
              'hidden' === i.visibility ||
              'true' === a.getAttribute('aria-hidden') ||
              'presentation' === a.getAttribute('role') ||
              'none' === a.getAttribute('role')
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    a,
                    e.HTMLCS.getAttribute(a, 'aria-hidden,role', !0),
                    'BB10495'
                  )
                : 1 < t.length
                ? a.hasAttribute('aria-label')
                  ? a.hasAttribute('aria-label') &&
                    a.hasAttribute('aria-labelledby')
                    ? a.hasAttribute('aria-labelledby') &&
                      (HTMLCS.util.hasValidLabelId(a)
                        ? this.checkAsideBlankAria(a, t, 'aria-labelledby')
                        : a.hasAttribute('aria-label')
                        ? this.checkAsideBlankAria(a, t, 'aria-label')
                        : HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            a,
                            'Missing ID',
                            'BB10302'
                          ))
                    : this.checkAsideBlankAria(a, t, 'aria-labelledby')
                  : a.hasAttribute('aria-labelledby')
                  ? HTMLCS.util.hasValidLabelId(a)
                    ? this.checkAsideBlankAria(a, t, 'aria-labelledby')
                    : a.hasAttribute('aria-label')
                    ? this.checkAsideBlankAria(a, t, 'aria-label')
                    : HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        a,
                        'Missing ID',
                        'BB10302'
                      )
                  : HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      a,
                      'No Accessible Name',
                      'BB10500'
                    )
                : a.hasAttribute('aria-label')
                ? HTMLCS.addMessage(
                    HTMLCS.NOTICE,
                    a,
                    e.HTMLCS.getAttribute(a, 'aria-label'),
                    'BB10496'
                  )
                : a.hasAttribute('aria-labelledby') &&
                  HTMLCS.addMessage(
                    HTMLCS.NOTICE,
                    a,
                    e.HTMLCS.getAttribute(a, 'aria-labelledby'),
                    'BB10497'
                  )
            })
        },
        checkNavTags: function (t) {
          if (0 < t.length) {
            let a = 0
            t.forEach((e) => {
              'none' !== HTMLCS.util.style(e)?.display &&
                'true' !== e.getAttribute('aria-hidden') &&
                'presentation' !== e.getAttribute('role') &&
                'none' !== e.getAttribute('role') &&
                a++
            }),
              t.forEach((i) => {
                'none' === HTMLCS.util.style(i)?.display ||
                'true' === i.getAttribute('aria-hidden') ||
                'presentation' === i.getAttribute('role') ||
                'none' === i.getAttribute('role')
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-hidden,role', !0),
                      'BB10412'
                    )
                  : 1 < a
                  ? i.hasAttribute('aria-label')
                    ? i.hasAttribute('aria-labelledby')
                      ? i.hasAttribute('aria-labelledby')
                        ? HTMLCS.util.hasValidLabelId(i) ||
                          (i.hasAttribute('aria-label')
                            ? this.checkBlankAria(i, t)
                            : HTMLCS.addMessage(
                                HTMLCS.ERROR,
                                i,
                                'Missing ID',
                                'BB10302'
                              ))
                        : (HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            'Missing aria-labelledby',
                            'BB10414'
                          ),
                          HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            'Check Nav Landmark',
                            'BB10423'
                          ))
                      : this.checkBlankAria(i, t)
                    : i.hasAttribute('aria-labelledby')
                    ? HTMLCS.util.hasValidLabelId(i)
                      ? 1 <
                        0 +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-label'
                          ) +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-labelledby'
                          ) +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'title'
                          )
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            'Identical Accessible Name',
                            'BB10514'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            'Check Nav Landmark',
                            'BB10413'
                          )
                      : i.hasAttribute('aria-label')
                      ? this.checkBlankAria(i, t)
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'Missing ID',
                          'BB10302'
                        )
                    : (HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        i,
                        'Missing aria-labelledby',
                        'BB10414'
                      ),
                      HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        i,
                        'Check Nav Landmark',
                        'BB10423'
                      ))
                  : i.hasAttribute('aria-label')
                  ? HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10489'
                    )
                  : i.hasAttribute('aria-labelledby')
                  ? HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                      'BB10490'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check Nav Landmark',
                      'BB10423'
                    )
              })
          }
        },
        checkFormBlankAria: function (t, a) {
          '' === t.getAttribute('aria-label').trim()
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(t, 'aria-label'),
                'BB10506'
              )
            : 1 <
              0 +
                e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                  a,
                  t,
                  'aria-label'
                ) +
                e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                  a,
                  t,
                  'aria-labelledby'
                ) +
                e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                  a,
                  t,
                  'title'
                )
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(t, 'aria-label'),
                'BB10520'
              )
            : HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                'missing aria-label',
                'BB10505'
              )
        },
        checkBlankAria: function (t, a) {
          '' === t.getAttribute('aria-label').trim()
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(t, 'aria-label'),
                'BB10526'
              )
            : 1 <
              0 +
                e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                  a,
                  t,
                  'aria-label'
                ) +
                e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                  a,
                  t,
                  'aria-labelledby'
                ) +
                e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                  a,
                  t,
                  'title'
                )
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'Identical Accessible Name',
                'BB10514'
              )
            : HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                'Check Nav Landmark',
                'BB10413'
              )
        },
        checkAsideBlankAria: function (t, a, i) {
          '' === t.getAttribute('aria-label').trim()
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(t, 'aria-label'),
                'BB10499'
              )
            : 1 <
              0 +
                e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                  a,
                  t,
                  i
                )
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(t, i),
                'BB10519'
              )
            : HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, i),
                'BB10498'
              )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Language = {
        get register() {
          return ['html']
        },
        process: function (t, a) {
          var i = [
            'ab',
            'aa',
            'af',
            'ak',
            'sq',
            'am',
            'ar',
            'an',
            'hy',
            'as',
            'av',
            'ae',
            'ay',
            'az',
            'bm',
            'ba',
            'eu',
            'be',
            'bn',
            'bi',
            'bs',
            'br',
            'bg',
            'my',
            'ca',
            'km',
            'ch',
            'ce',
            'ny',
            'zh',
            'cu',
            'cv',
            'kw',
            'co',
            'cr',
            'hr',
            'cs',
            'da',
            'dv',
            'nl',
            'dz',
            'en',
            'eo',
            'et',
            'ee',
            'fo',
            'fj',
            'fi',
            'fr',
            'ff',
            'gd',
            'gl',
            'lg',
            'ka',
            'de',
            'el',
            'gn',
            'gu',
            'ht',
            'ha',
            'he',
            'hz',
            'hi',
            'ho',
            'hu',
            'is',
            'io',
            'ig',
            'id',
            'ia',
            'ie',
            'iu',
            'ik',
            'ga',
            'it',
            'ja',
            'jv',
            'kl',
            'kn',
            'kr',
            'ks',
            'kk',
            'ki',
            'rw',
            'ky',
            'kv',
            'kg',
            'ko',
            'kj',
            'ku',
            'lo',
            'la',
            'lv',
            'li',
            'ln',
            'lt',
            'lu',
            'lb',
            'mk',
            'mg',
            'ms',
            'ml',
            'mt',
            'gv',
            'mi',
            'mr',
            'mh',
            'mn',
            'na',
            'nv',
            'ng',
            'ne',
            'nd',
            'se',
            'no',
            'nb',
            'nn',
            'oc',
            'oj',
            'or',
            'om',
            'os',
            'pi',
            'ps',
            'fa',
            'pl',
            'pt',
            'pa',
            'qu',
            'ro',
            'rm',
            'rn',
            'ru',
            'sm',
            'sg',
            'sa',
            'sc',
            'sr',
            'sn',
            'ii',
            'sd',
            'si',
            'sk',
            'sl',
            'so',
            'nr',
            'st',
            'es',
            'su',
            'sw',
            'ss',
            'sv',
            'tl',
            'ty',
            'tg',
            'ta',
            'tt',
            'te',
            'th',
            'bo',
            'ti',
            'to',
            'ts',
            'tn',
            'tr',
            'tk',
            'tw',
            'ug',
            'uk',
            'ur',
            'uz',
            've',
            'vi',
            'vo',
            'wa',
            'cy',
            'fy',
            'wo',
            'xh',
            'yi',
            'yo',
            'za',
            'zu',
          ]
          if (
            !1 === t.hasAttribute('lang') &&
            !1 === t.hasAttribute('xml:lang')
          )
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              'No language Attribute Found',
              'BB10459'
            )
          else {
            let a = t.getAttribute('lang') || t.getAttribute('xml:lang')
            var n = a.split('-')
            1 < n.length && (a = n[0]),
              i.includes(a)
                ? navigator.language.split('-')[0] != a
                  ? HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      e.HTMLCS.getAttribute(t, 'lang'),
                      'BB10461'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.PASS,
                      t,
                      e.HTMLCS.getAttribute(t, 'lang'),
                      'BB10481'
                    )
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getAttribute(t, 'lang'),
                    'BB10460'
                  )
          }
          if (
            0 <
            (n =
              document.body.querySelectorAll('[lang]') ||
              document.body.querySelectorAll('[xml:lang]')).length
          )
            for (let a of n) {
              let n = a.getAttribute('lang') || a.getAttribute('xml:lang')
              var s = n.split('-')
              1 < s.length && (n = s[0]),
                i.includes(n)
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      t,
                      e.HTMLCS.getAttribute(a, 'lang'),
                      'BB10510'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      e.HTMLCS.getAttribute(a, 'lang'),
                      'BB10460'
                    )
            }
          else
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              'Lang Attribute Missing',
              'BB10509'
            )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Links = {
        get register() {
          return ['_top', 'a']
        },
        process: function (e) {
          for (let t of HTMLCS.util.getUniversalElements(e, 'a'))
            this.checkLinkTag(t)
        },
        checkLinkTag: function (t) {
          if (t.hasAttribute('hreflang')) {
            let i = t.getAttribute('hreflang')
            var a = i.split('-')
            1 < a.length && (i = a[0]),
              [
                'ab',
                'aa',
                'af',
                'ak',
                'sq',
                'am',
                'ar',
                'an',
                'hy',
                'as',
                'av',
                'ae',
                'ay',
                'az',
                'bm',
                'ba',
                'eu',
                'be',
                'bn',
                'bi',
                'bs',
                'br',
                'bg',
                'my',
                'ca',
                'km',
                'ch',
                'ce',
                'ny',
                'zh',
                'cu',
                'cv',
                'kw',
                'co',
                'cr',
                'hr',
                'cs',
                'da',
                'dv',
                'nl',
                'dz',
                'en',
                'eo',
                'et',
                'ee',
                'fo',
                'fj',
                'fi',
                'fr',
                'ff',
                'gd',
                'gl',
                'lg',
                'ka',
                'de',
                'el',
                'gn',
                'gu',
                'ht',
                'ha',
                'he',
                'hz',
                'hi',
                'ho',
                'hu',
                'is',
                'io',
                'ig',
                'id',
                'ia',
                'ie',
                'iu',
                'ik',
                'ga',
                'it',
                'ja',
                'jv',
                'kl',
                'kn',
                'kr',
                'ks',
                'kk',
                'ki',
                'rw',
                'ky',
                'kv',
                'kg',
                'ko',
                'kj',
                'ku',
                'lo',
                'la',
                'lv',
                'li',
                'ln',
                'lt',
                'lu',
                'lb',
                'mk',
                'mg',
                'ms',
                'ml',
                'mt',
                'gv',
                'mi',
                'mr',
                'mh',
                'mn',
                'na',
                'nv',
                'ng',
                'ne',
                'nd',
                'se',
                'no',
                'nb',
                'nn',
                'oc',
                'oj',
                'or',
                'om',
                'os',
                'pi',
                'ps',
                'fa',
                'pl',
                'pt',
                'pa',
                'qu',
                'ro',
                'rm',
                'rn',
                'ru',
                'sm',
                'sg',
                'sa',
                'sc',
                'sr',
                'sn',
                'ii',
                'sd',
                'si',
                'sk',
                'sl',
                'so',
                'nr',
                'st',
                'es',
                'su',
                'sw',
                'ss',
                'sv',
                'tl',
                'ty',
                'tg',
                'ta',
                'tt',
                'te',
                'th',
                'bo',
                'ti',
                'to',
                'ts',
                'tn',
                'tr',
                'tk',
                'tw',
                'ug',
                'uk',
                'ur',
                'uz',
                've',
                'vi',
                'vo',
                'wa',
                'cy',
                'fy',
                'wo',
                'xh',
                'yi',
                'yo',
                'za',
                'zu',
              ].includes(i)
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getAttribute(t, 'hreflang'),
                    'BB10512'
                  )
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getAttribute(t, 'hreflang'),
                    'BB10460'
                  )
          } else
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              "Check the target page's language",
              'BB10511'
            )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Lists = {
        get register() {
          return ['_top', 'ol', 'ul', 'dl', 'div', 'span', 'p']
        },
        process: function (e) {
          for (let t of HTMLCS.util.getUniversalElements(e, 'ol,ul,dl'))
            this.checkListTags(t)
        },
        checkListTags: function (t) {
          let a = !0
          if ('OL' !== t.nodeName && 'UL' !== t.nodeName)
            for (let i of HTMLCS.util.getUniversalElements(t, '*'))
              1 === i.nodeType &&
                i.hasAttribute('role') &&
                'LI' === i.nodeName &&
                (HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  i,
                  e.HTMLCS.getAttribute(i, 'role'),
                  'BB10368'
                ),
                (a = !1))
          ;('OL' === t.nodeName || 'UL' === t.nodeName) && a
            ? this.ActualList(t)
            : 'DL' === t.nodeName && this.DefList(t)
        },
        RoleTypeList: function (t) {
          let a = !1,
            i = 0,
            n = !1,
            s = !1,
            r = !1,
            l = !1
          for (let e of t.childNodes)
            if (1 === e.nodeType) {
              if (
                ('listitem' === e.getAttribute('role') &&
                  'true' === e.getAttribute('aria-hidden') &&
                  (a = !0),
                'listitem' === e.getAttribute('role') &&
                  (i++,
                  0 === HTMLCS.util.getElementTextContent(e).trim().length &&
                    (n = !0),
                  0 < e.childNodes.length))
              )
                for (let t of e.childNodes)
                  1 === t.nodeType &&
                    'listitem' === t.getAttribute('role') &&
                    (l = !0)
              ;('DT' !== e.nodeName && 'DD' !== e.nodeName) || (s = !0),
                ('LI' === e.nodeName &&
                  'listitem' === e.getAttribute('role')) ||
                  (r = !0)
            }
          'true' === t.getAttribute('aria-hidden') || a
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-hidden,role', !0),
                'BB10363'
              )
            : s
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'check child listitem',
                'BB10380'
              )
            : 0 === i
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'No Child listitems',
                'BB10377'
              )
            : n
            ? HTMLCS.addMessage(HTMLCS.ERROR, t, 'Empty listitems', 'BB10379')
            : s
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'Incorrect Listitems',
                'BB10380'
              )
            : r
            ? l
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'Check nested listitems',
                  'BB10382'
                )
              : HTMLCS.addMessage(HTMLCS.PASS, t, 'Correct List', 'BB10366')
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'Have different listitems',
                'BB10381'
              )
        },
        ActualList: function (t) {
          let a = !1,
            i = !1,
            n = !0,
            s = !1,
            r = !1,
            l = !1
          for (let e of t.childNodes)
            if (1 === e.nodeType) {
              if ('LI' === e.nodeName) {
                for (let t of ((a = !0),
                0 === HTMLCS.util.getElementTextContent(e).trim().length &&
                  0 === e.childNodes.length &&
                  (n = !1),
                e.childNodes))
                  1 === t.nodeType && 'LI' === t.nodeName && (s = !0)
                'list' === t.getAttribute('role') && (r = !0),
                  'listitem' === e.getAttribute('role') && (l = !0)
              } else i = !0
            }
          ;(t.hasAttribute('role') &&
            'presentation' === t.getAttribute('role')) ||
          (t.hasAttribute('role') && 'none' === t.getAttribute('role')) ||
          (t.hasAttribute('aria-hidden') &&
            'true' === t.getAttribute('aria-hidden'))
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'role,aria-hidden', !0),
                'BB10363'
              )
            : a
            ? i
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'Check List Items',
                  'BB10422'
                )
              : n
              ? s
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    'Inner listitems',
                    'BB10370'
                  )
                : r
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getAttribute(t, 'role'),
                    'BB10400'
                  )
                : l
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getAttribute(t, 'role'),
                    'BB10401'
                  )
                : r || l
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getAttribute(t, 'role'),
                    'BB10378'
                  )
                : HTMLCS.addMessage(HTMLCS.PASS, t, 'Correct List', 'BB10366')
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'Different Child List items',
                  'BB10369'
                )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                '<li> is not present',
                'BB10364'
              )
        },
        DefList: function (t) {
          let a = 0,
            i = 0,
            n = 0,
            s = !1,
            r = 0,
            l = !1
          for (let e of HTMLCS.util.getUniversalElements(t, '*'))
            1 === e.nodeType &&
              ('DT' === e.nodeName &&
                (a++,
                0 === HTMLCS.util.getElementTextContent(e).trim().length &&
                  (s = !0),
                0 == r) &&
                (l = !0),
              'DD' === e.nodeName &&
                (i++,
                0 === HTMLCS.util.getElementTextContent(e).trim().length) &&
                (s = !0),
              'LI' === e.nodeName && n++,
              r++)
          ;(t.hasAttribute('role') &&
            'presentation' === t.getAttribute('role')) ||
          (t.hasAttribute('role') && 'none' === t.getAttribute('role')) ||
          (t.hasAttribute('aria-hidden') &&
            'true' === t.getAttribute('aria-hidden'))
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'role,aria-hidden', !0),
                'BB10363'
              )
            : n
            ? HTMLCS.addMessage(HTMLCS.ERROR, t, 'has <li> elements', 'BB10375')
            : a
            ? l
              ? i
                ? s
                  ? HTMLCS.addMessage(HTMLCS.ERROR, t, 'Empty List', 'BB10376')
                  : HTMLCS.addMessage(HTMLCS.PASS, t, 'Correct List', 'BB10366')
                : HTMLCS.addMessage(HTMLCS.ERROR, t, 'Check list', 'BB10374')
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'Check list items sequence',
                  'BB10373'
                )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'Check other list items',
                'BB10372'
              )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Native = {
        get register() {
          return ['_top']
        },
        process: function (t) {
          for (let i of HTMLCS.util.getUniversalElements(
            t,
            'textarea,input[type="text"]'
          )) {
            var a
            i.hasAttribute('aria-labelledby')
              ? HTMLCS.util.hasValidLabelId(i)
                ? (HTMLCS.addMessage(
                    HTMLCS.PASS,
                    i,
                    e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                    'BB10632'
                  ),
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    i,
                    e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                    'BB10635'
                  ))
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    i,
                    'No Associate ID found',
                    'BB10302'
                  )
              : i.hasAttribute('aria-label')
              ? '' === i.getAttribute('aria-label').trim()
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    i,
                    'Blank Aria Label',
                    'BB10633'
                  )
                : (HTMLCS.addMessage(
                    HTMLCS.PASS,
                    i,
                    e.HTMLCS.getAttribute(i, 'aria-label'),
                    'BB10632'
                  ),
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    i,
                    e.HTMLCS.getAttribute(i, 'aria-label'),
                    'BB10635'
                  ))
              : i.hasAttribute('title')
              ? '' === i.getAttribute('title').trim()
                ? HTMLCS.addMessage(HTMLCS.ERROR, i, 'Blank Title', 'BB10634')
                : (HTMLCS.addMessage(
                    HTMLCS.PASS,
                    i,
                    e.HTMLCS.getAttribute(i, 'title'),
                    'BB10632'
                  ),
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    i,
                    e.HTMLCS.getAttribute(i, 'title'),
                    'BB10635'
                  ))
              : i.getAttribute('id')
              ? HTMLCS.util.hasValidForId(i)
                ? (HTMLCS.addMessage(
                    HTMLCS.PASS,
                    i,
                    e.HTMLCS.getAttribute(i, 'id'),
                    'BB10632'
                  ),
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    i,
                    e.HTMLCS.getAttribute(i, 'id'),
                    'BB10635'
                  ))
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    i,
                    'No Associate ID found',
                    'BB10534'
                  )
              : (a = this.getParentLabel(i))
              ? '' !== HTMLCS.util.getTextContent(a).trim()
                ? (HTMLCS.addMessage(
                    HTMLCS.PASS,
                    i,
                    HTMLCS.util.getTextContent(a).trim(),
                    'BB10632'
                  ),
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    i,
                    HTMLCS.util.getTextContent(a).trim(),
                    'BB10635'
                  ))
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    a,
                    'Check Label Parent',
                    'BB10432'
                  )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  i.parentElement,
                  'Check Label Parent',
                  'BB10432'
                )
          }
          for (let a of HTMLCS.util.getUniversalElements(
            t,
            'input[type="checkbox"]'
          )) {
            let t = !1,
              s = !1,
              r = !0,
              l = !1,
              o = null,
              d = !1,
              u = !1
            var i = HTMLCS.util.getPreviousSiblingElement(a, 'LABEL'),
              n = HTMLCS.util.getNextSiblingElement(a, 'LABEL')
            if (null !== i || null !== n) {
              let e = i
              null === i && (e = n),
                (i = HTMLCS.util.style(e)?.display),
                'true' !== e.getAttribute('aria-hidden') && 'none' !== i
                  ? 'LABEL' === e.parentNode.nodeName
                    ? (s = !0)
                    : (a.hasAttribute('id') || (r = !1),
                      e.hasAttribute('for') &&
                        ((l = !0),
                        (o = e.getAttribute('for') == a.getAttribute('id'))))
                  : (u = !0)
            }
            a.hasAttribute('title') && (t = !0),
              a.hasAttribute('aria-label') && (d = !0),
              a.hasAttribute('aria-labelledby')
                ? HTMLCS.util.hasValidLabelId(a)
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getAttribute(a, 'aria-labelledby'),
                      'BB10431'
                    )
                  : HTMLCS.addMessage(HTMLCS.ERROR, a, 'Missing ID', 'BB10302')
                : u
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    a,
                    'Label is Hidden',
                    'BB10432'
                  )
                : d
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    a,
                    e.HTMLCS.getAttribute(a, 'aria-label'),
                    'BB10431'
                  )
                : s
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    a,
                    'Has Label as Parent',
                    'BB10431'
                  )
                : o
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    a,
                    e.HTMLCS.getAttribute(a, 'id'),
                    'BB10431'
                  )
                : t
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    a,
                    e.HTMLCS.getAttribute(a, 'title'),
                    'BB10431'
                  )
                : l && r
                ? o
                  ? HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      a,
                      e.HTMLCS.getAttribute(a, 'id'),
                      'BB10534'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      a,
                      'Missing Accessible Name',
                      'BB10432'
                    )
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    a,
                    'for id Association Missing',
                    'BB10533'
                  )
          }
        },
        getParentLabel: function (e) {
          let t = null,
            a = e.parentElement
          for (; 'BODY' !== a.nodeName; ) {
            if ('LABEL' === a.nodeName) {
              t = a
              break
            }
            a = a.parentElement
          }
          return t
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_SkipLinks = {
        get register() {
          return ['_top']
        },
        process: function (e, t) {
          var a = ['skip', 'content'],
            i = HTMLCS.util.getUniversalElements(
              t,
              'h1, h2, h3, h4, h5, h6,main,nav,aside,header,footer'
            )
          let n = HTMLCS.util
              .getTextContent(document.body)
              .trim()
              .toLowerCase(),
            s = 0,
            r = null,
            l = document.body
          if (a.some((e) => n.includes(e))) {
            for (let e of HTMLCS.util.getUniversalElements(
              t,
              'button, a, input'
            )) {
              let t = HTMLCS.util.getTextContent(e).trim().toLowerCase()
              if (a.some((e) => t.includes(e))) {
                r = e
                break
              }
              s++
            }
            r && (l = r),
              3 < s &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  l,
                  'Skip Element Not Focusable',
                  'BB10451'
                ),
              HTMLCS.addMessage(HTMLCS.WARNING, l, 'Check Skip Link', 'BB10452')
          } else
            0 < i.length
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  l,
                  'Skip Link Missing',
                  'BB10450'
                )
              : HTMLCS.addMessage(
                  HTMLCS.NOTICE,
                  l,
                  'Skip Link Present',
                  'BB10570'
                )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Svg = {
        get register() {
          return ['_top', 'svg']
        },
        process: function (e, t) {
          for (let e of HTMLCS.util.getUniversalElements(t, 'svg')) {
            let t = !1,
              a = e.parentElement
            for (
              let e = 0;
              e < 20 && 'body' !== a.nodeName.toLowerCase();
              e++
            ) {
              if (
                'button' === a.nodeName.toLowerCase() ||
                'a' === a.nodeName.toLowerCase()
              ) {
                t = !0
                break
              }
              a = a.parentElement
            }
            t || this.checkSvgHasParent(e)
          }
        },
        validateSvgTag: function (e, t) {
          this.checkSvgHasParent(e, t)
        },
        checkSvgHasParent: function (t, a = null) {
          a = null !== a ? a : t
          let i = !1,
            n = 0,
            s = !1,
            r = !1,
            l = !0
          var o = t ? t.childNodes.length : 0,
            d = []
          for (let e of HTMLCS.util.getUniversalElements(t, '*')) d.push(e)
          for (let e = 0; e < o; e++) d[e] = t.childNodes[e]
          for (d.length = o; 0 < d.length; ) {
            var u = d.shift()
            1 === u.nodeType &&
              ('text' === u.nodeName.toLowerCase() && (i = !0),
              'title' === u.nodeName.toLowerCase() &&
                (0 === n ? (s = !0) : (r = !0)),
              n++)
          }
          ;('img' != t.getAttribute('role') &&
            'graphics-symbol' != t.getAttribute('role')) ||
            (l = !1),
            (t.hasAttribute('role') &&
              'presentation' === t.getAttribute('role')) ||
            (t.hasAttribute('role') && 'none' === t.getAttribute('role')) ||
            (t.hasAttribute('aria-hidden') &&
              'true' === t.getAttribute('aria-hidden'))
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  a,
                  e.HTMLCS.getAttribute(t, 'role,aria-hidden', !0),
                  'BB10306'
                )
              : t.hasAttribute('aria-label')
              ? (l &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    a,
                    e.HTMLCS.getAttribute(t, 'role'),
                    'BB10307'
                  ),
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  a,
                  e.HTMLCS.getAttribute(t, 'aria-label'),
                  'BB10301'
                ))
              : t.hasAttribute('aria-labelledby') ||
                t.hasAttribute('aria-describedby')
              ? HTMLCS.util.hasValidLabelId(t)
                ? (l &&
                    HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      a,
                      'No Role Found',
                      'BB10307'
                    ),
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    a,
                    e.HTMLCS.getAttribute(a, 'role'),
                    'BB10301'
                  ))
                : HTMLCS.addMessage(HTMLCS.ERROR, a, 'Missing ID', 'BB10302')
              : i || s
              ? HTMLCS.addMessage(HTMLCS.WARNING, a, 'Content Found', 'BB10301')
              : r
              ? (HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  a,
                  'Title is not the first element',
                  'BB10309'
                ),
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  a,
                  'Check Title Element',
                  'BB10301'
                ))
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  a,
                  'Missing accessible name for svg',
                  'BB10308'
                )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Title = {
        get register() {
          return ['_top', 'title']
        },
        process: function (e) {
          for (let a of HTMLCS.util.getUniversalElements(e, 'head')) {
            var t = HTMLCS.util.getUniversalElements(a, 'title')
            0 < t.length
              ? t.forEach((e) => {
                  var t = HTMLCS.util.getElementTextContent(e)
                  0 < t.length
                    ? HTMLCS.addMessage(HTMLCS.WARNING, e, t, 'BB10086')
                    : HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        e,
                        'Empty Title Tag',
                        'BB10082'
                      )
                })
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  a,
                  'No Title Tag found',
                  'BB10081'
                )
          }
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Universal = {
        get register() {
          return ['_top']
        },
        process: (t) => {
          var a = [],
            i = [],
            n = []
          for (let T of HTMLCS.util.getUniversalElements(t, 'body *')) {
            let t = ''
            if (
              (T.hasAttribute('role') && (t = T.getAttribute('role')),
              'BLINK' === T.nodeName &&
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  T,
                  'Blink Element Found',
                  'BB10446'
                ),
              'MARQUEE' === T.nodeName &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  T,
                  'Depreacted Element',
                  'BB10448'
                ),
              'AUDIO' === T.nodeName || 'VIDEO' === T.nodeName)
            ) {
              let t = null
              for (let e of T.childNodes) 'SOURCE' === e.nodeName && (t = e)
              T.hasAttribute('autoplay') &&
                t.hasAttribute('src') &&
                0 < t.getAttribute('src').length &&
                ((r = T).duration <= 3
                  ? HTMLCS.addMessage(
                      HTMLCS.PASS,
                      T,
                      'Media Duration: ' + r.duration + ' secs',
                      'BB10455'
                    )
                  : T.hasAttribute('autoplay') &&
                    (T.hasAttribute('mute') || 0 == r.volume)
                  ? HTMLCS.addMessage(
                      HTMLCS.PASS,
                      T,
                      e.HTMLCS.getAttribute(T, 'mute,autoplay', !0),
                      'BB10456'
                    )
                  : (HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      T,
                      'Check Controls',
                      'BB10457'
                    ),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      T,
                      'Check AutoPlay',
                      'BB10458'
                    )))
            }
            if (3 === T.nodeType) {
              var s,
                r = HTMLCS.util.getPreviousSiblingElement(T, 'A'),
                l = HTMLCS.util.getNextSiblingElement(T, 'A')
              if (null !== r || null !== l) {
                let e = r
                null === r && (e = l)
                var l = HTMLCS.util.style(e),
                  o = HTMLCS.util.style(T),
                  d = l.color,
                  o = o.color,
                  d = HTMLCS.util.contrastRatio(d, o),
                  o = 0.01 * Math.trunc(d / 0.01)
                3 <= o
                  ? HTMLCS.addMessage(HTMLCS.PASS, T, o + ':1', 'BB10621')
                  : 'underline' === l.textDecoration || 'bold' === l.fontWeight
                  ? HTMLCS.addMessage(HTMLCS.PASS, T, 'Perfect Link', 'BB10621')
                  : HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      T,
                      'Check Link Styling',
                      'BB10620'
                    )
              }
            }
            ;('LI' !== T.nodeName && 'listitem' !== t) ||
              ('UL' !== T.parentElement.nodeName &&
                'OL' !== T.parentElement.nodeName &&
                'list' !== T.getAttribute('role') &&
                1 === T.parentElement.nodeType &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  T,
                  'No Parent UL OL',
                  'BB10368'
                )),
              ('DT' !== T.nodeName && 'DD' !== T.nodeName) ||
                ('DL' !== T.parentElement.nodeName &&
                  'list' !== T.getAttribute('role') &&
                  1 === T.parentElement.nodeType &&
                  HTMLCS.addMessage(HTMLCS.ERROR, T, 'No Parent DL', 'BB10371'))
            let M = null,
              C = !1,
              h =
                ((M = (d = HTMLCS.util.style(T)).backgroundColor),
                T.parentElement),
              S = !1
            for (
              'none' !== d.backgroundImage && (S = !0);
              ('transparent' === M || 'rgba(0, 0, 0, 0)' === M) &&
              h &&
              h.ownerDocument;

            ) {
              var u = HTMLCS.util.style(h)
              'none' !== u.backgroundImage && (S = !0),
                (M = u.backgroundColor),
                (h = h.parentElement)
            }
            ;(o = d.color), (l = parseFloat(d?.fontSize))
            let H = HTMLCS.util.colourStrToRGB(M).alpha
            ;(!S || 0 < H) &&
              ((M = 'rgba(0, 0, 0, 0)' === M ? 'rgba(255,255,255,1)' : M),
              (H = HTMLCS.util.colourStrToRGB(M).alpha))
            for (
              var g = HTMLCS.util.contrastRatio(M, o),
                c =
                  'fontsize--' +
                  l +
                  '==fontweight--' +
                  d.fontWeight +
                  '==forec--' +
                  o +
                  '==backc--' +
                  M +
                  '==ratio--' +
                  0.01 * Math.trunc(g / 0.01) +
                  ':1',
                _ = 0;
              _ < T.childNodes.length;
              _++
            )
              3 === T.childNodes[_].nodeType &&
                T.childNodes[_].nodeValue &&
                '' !== T.childNodes[_].nodeValue.trim() &&
                (C = !0)
            let L = !1
            if (
              'hidden' !== d.visibility &&
              'none' !== d.display &&
              !HTMLCS.util.isDisabled(T)
            ) {
              let e = T.parentElement
              for (HTMLCS.util.style(e); 'BODY' !== e.nodeName; ) {
                if (
                  'hidden' === (s = HTMLCS.util.style(e)).visibility ||
                  'none' === s.display ||
                  HTMLCS.util.isDisabled(e)
                ) {
                  L = !0
                  break
                }
                e = e.parentElement
              }
            }
            switch (
              ('true' === T.getAttribute('aria-hidden') ||
                'hidden' === d.visibility ||
                'none' === d.display ||
                'true' === T.getAttribute('aria-disabled') ||
                HTMLCS.util.isDisabled(T) ||
                L ||
                !C ||
                (l < 24 &&
                'bold' !== d.fontWeight &&
                700 > parseInt(d.fontWeight, 10) &&
                S
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      T,
                      'Has Background Image',
                      'BB10575'
                    )
                  : l < 24 &&
                    'bold' !== d.fontWeight &&
                    700 > parseInt(d.fontWeight, 10) &&
                    H < 1
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      T,
                      'Check Color Contrast',
                      'BB10628'
                    )
                  : (18.5 <= l ||
                      'bold' === d.fontWeight ||
                      700 <= parseInt(d.fontWeight, 10)) &&
                    S
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      T,
                      'Check the Color Contrast with BG Image',
                      'BB10615'
                    )
                  : 18.5 <= l &&
                    ('bold' === d.fontWeight ||
                      700 <= parseInt(d.fontWeight, 10)) &&
                    H < 1
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      T,
                      'Check the Color Contrast',
                      'BB10629'
                    )
                  : l < 24 &&
                    'bold' !== d.fontWeight &&
                    700 > parseInt(d.fontWeight, 10)
                  ? g < 4.5
                    ? HTMLCS.addMessage(HTMLCS.ERROR, T, c, 'BB10571')
                    : HTMLCS.addMessage(HTMLCS.PASS, T, c, 'BB10572')
                  : ((19 <= l &&
                      l <= 23 &&
                      ('bold' === d.fontWeight ||
                        700 <= parseInt(d.fontWeight, 10))) ||
                      24 <= l) &&
                    (3 <= g
                      ? HTMLCS.addMessage(HTMLCS.PASS, T, c, 'BB10574')
                      : HTMLCS.addMessage(HTMLCS.ERROR, T, c, 'BB10573'))),
              t)
            ) {
              case 'textbox':
                e.HTMLCS_SectionBB_Sniffs_Universal.checkTextboxRole(T)
                break
              case 'search':
                a.push(T)
                break
              case 'list':
                e.HTMLCS_SectionBB_Sniffs_Lists.RoleTypeList(T)
                break
              case 'switch':
                e.HTMLCS_SectionBB_Sniffs_Universal.checkSwitchState(T)
                break
              case 'radio':
                e.HTMLCS_SectionBB_Sniffs_Universal.checkRadioState(T)
                break
              case 'directory':
                e.HTMLCS_SectionBB_Sniffs_Universal.checkDeperacted(T)
                break
              case 'meter':
                i.push(T)
                break
              case 'checkbox':
                n.push(T)
                break
              case 'dialog':
              case 'alertdialog':
                e.HTMLCS_SectionBB_Sniffs_Dialog.checkDialog(T)
                break
              default:
                '' != t &&
                  e.HTMLCS_SectionBB_Sniffs_Universal.roleValidation(T, t)
            }
          }
          e.HTMLCS_SectionBB_Sniffs_Universal.checkSearchTags(a),
            e.HTMLCS_SectionBB_Sniffs_Universal.checkBodyTags(),
            e.HTMLCS_SectionBB_Sniffs_Universal.checkMeterTags(i),
            e.HTMLCS_SectionBB_Sniffs_Universal.checkBoxTags(n)
        },
        roleValidation: function (t, a) {
          ;[
            'alert',
            'alertdialog',
            'application',
            'article',
            'banner',
            'button',
            'cell',
            'checkbox',
            'columnheader',
            'combobox',
            'command',
            'comment',
            'complementary',
            'composite',
            'contentinfo',
            'definition',
            'dialog',
            'directory',
            'document',
            'feed',
            'figure',
            'form',
            'generic',
            'grid',
            'gridcell',
            'group',
            'heading',
            'img',
            'input',
            'landmark',
            'link',
            'list',
            'listbox',
            'listitem',
            'log',
            'main',
            'mark',
            'marquee',
            'math',
            'menu',
            'menubar',
            'menubar',
            'menuitem',
            'menuitemcheckbox',
            'menuitemradio',
            'meter',
            'navigation',
            'none',
            'note',
            'option',
            'presentation',
            'progressbar',
            'radio',
            'radiogroup',
            'range',
            'region',
            'roletype',
            'row',
            'rowgroup',
            'rowgroup',
            'rowheader',
            'rowheader',
            'scrollbar',
            'search',
            'searchbox',
            'section',
            'sectionhead',
            'select',
            'separator',
            'slider',
            'spinbutton',
            'status',
            'structure',
            'suggestion',
            'switch',
            'tab',
            'table',
            'tablist',
            'tabpanel',
            'term',
            'texbox',
            'timer',
            'toolbar',
            'tooltip',
            'tree',
            'treegrid',
            'treegrid',
            'treeitem',
            'widget',
            'window',
          ].includes(a) ||
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              e.HTMLCS.getAttribute(t, 'role'),
              'BB10576'
            )
        },
        checkHeadings: function (t) {
          for (let n of HTMLCS.util.getUniversalElements(t, 'div,span,p')) {
            var a,
              i = HTMLCS.util.style(n),
              i = parseFloat(i?.fontSize)
            let t = 0
            'BODY' != n.parentNode.nodeName &&
              ((a = HTMLCS.util.style(n.parentElement)),
              (t = parseFloat(a?.fontSize))),
              20 < i &&
                t < 20 &&
                'true' !== n.getAttribute('aria-hidden') &&
                'presentation' !== n.getAttribute('role') &&
                'none' !== n.getAttribute('role') &&
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  n,
                  e.HTMLCS.getAttribute(n, 'aria-hidden,role', !0),
                  'BB10568'
                )
          }
        },
        checkBoxTags: function (t) {
          0 < t.length &&
            t.forEach((t) => {
              t.hasAttribute('aria-pressed')
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getAttribute(t, 'aria-pressed'),
                    'BB10530'
                  )
                : t.hasAttribute('aria-checked')
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getAttribute(t, 'aria-checked'),
                    'BB10532'
                  )
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    'No Aria Checked Attribute',
                    'BB10531'
                  ),
                'BUTTON' !== t.nodeName
                  ? '0' === t.getAttribute('tabindex')
                    ? HTMLCS.addMessage(
                        HTMLCS.PASS,
                        t,
                        e.HTMLCS.getAttribute(t, 'tabindex'),
                        'BB10552'
                      )
                    : HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        'Tabindex Missing',
                        'BB10551'
                      )
                  : HTMLCS.addMessage(
                      HTMLCS.PASS,
                      t,
                      'Button Element',
                      'BB10552'
                    ),
                'none' === HTMLCS.util.style(t)?.display ||
                '-1' === t.getAttribute('tabindex') ||
                'true' === t.getAttribute('aria-hidden')
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      t,
                      'Hidden from Accessibility Tree',
                      'BB10542'
                    )
                  : t.hasAttribute('aria-labelledby')
                  ? HTMLCS.util.hasValidLabelId(t)
                    ? HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        t,
                        e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                        'BB10545'
                      )
                    : HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        'No Associate ID found',
                        'BB10302'
                      )
                  : t.hasAttribute('aria-label')
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      t,
                      e.HTMLCS.getAttribute(t, 'aria-label'),
                      'BB10545'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      'No Aria-Label or Aria-Labelledby found',
                      'BB10543'
                    )
            })
        },
        checkMeterTags: function (t) {
          if (0 < t.length) {
            let a = !1,
              i = !1
            t.forEach((t) => {
              'none' === HTMLCS.util.style(t)?.display ||
              'true' === t.getAttribute('aria-hidden')
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getAttribute(t, 'aria-hidden'),
                    'BB10441'
                  )
                : ('0' === t.getAttribute('tabindex') &&
                    HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      e.HTMLCS.getAttribute(t, 'tabindex'),
                      'BB10445'
                    ),
                  t.hasAttribute('title') && (a = !0),
                  t.hasAttribute('aria-label')
                    ? (i = '' === t.getAttribute('aria-label').trim())
                    : t.hasAttribute('aria-labelledby')
                    ? HTMLCS.util.hasValidLabelId(t) ||
                      HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        'Missing ID',
                        'BB10302'
                      )
                    : i
                    ? HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        e.HTMLCS.getAttribute(t, 'aria-label'),
                        'BB10443'
                      )
                    : a
                    ? HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        t,
                        e.HTMLCS.getAttribute(t, 'title'),
                        'BB10442'
                      )
                    : HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        'Title Attribute Missing',
                        'BB10444'
                      )),
                t.hasAttribute('aria-valuemin')
                  ? (0 == t.getAttribute('aria-valuemin').trim().length &&
                      HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        e.HTMLCS.getAttribute(t, 'aria-valuemin'),
                        'BB10484'
                      ),
                    t.hasAttribute('aria-valuemax')
                      ? (0 == t.getAttribute('aria-valuemax').trim().length &&
                          HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            t,
                            e.HTMLCS.getAttribute(t, 'aria-valuemax'),
                            'BB10484'
                          ),
                        t.hasAttribute('aria-valuemax')
                          ? 0 == t.getAttribute('aria-valuemax').trim().length
                            ? HTMLCS.addMessage(
                                HTMLCS.ERROR,
                                t,
                                e.HTMLCS.getAttribute(t, 'aria-valuemax'),
                                'BB10486'
                              )
                            : HTMLCS.addMessage(
                                HTMLCS.WARNING,
                                t,
                                e.HTMLCS.getAttribute(t, 'aria-valuemax'),
                                'BB10488'
                              )
                          : HTMLCS.addMessage(
                              HTMLCS.ERROR,
                              t,
                              'aria-valuemax is not set',
                              'BB10487'
                            ))
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          t,
                          'Missing Attribute',
                          'BB10485'
                        ))
                  : HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      'aria-valuemin missing',
                      'BB10483'
                    ),
                '0' === t.getAttribute('tabindex') &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getAttribute(t, 'tabindex'),
                    'BB10445'
                  )
              var n = HTMLCS.util.getPreviousSiblingElement(t, 'LABEL'),
                t = HTMLCS.util.getNextSiblingElement(t, 'LABEL')
              ;(null !== n || null !== t) && console.log(null === n ? t : n)
            })
          }
        },
        checkBodyTags: function () {
          'true' === document.body.getAttribute('aria-hidden') &&
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              document.body,
              e.HTMLCS.getAttribute(document.body, 'aria-hidden'),
              'BB10440'
            )
        },
        checkDeperacted: function (t) {
          'directory' === t.getAttribute('role') &&
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              e.HTMLCS.getAttribute(t, 'role'),
              'BB10439'
            )
        },
        checkTextboxRole: function (t) {
          'none' === HTMLCS.util.style(t)?.display ||
          (t.hasAttribute('aria-hidden') &&
            'true' === t.getAttribute('aria-hidden')) ||
          (t.hasAttribute('tabindex') && '-1' === t.getAttribute('tabindex'))
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-hidden,tabindex', !0),
                'BB10430'
              )
            : t.hasAttribute('aria-label')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-label'),
                'BB10431'
              )
            : t.hasAttribute('aria-labelledby') ||
              t.hasAttribute('aria-describedby')
            ? HTMLCS.util.hasValidLabelId(t)
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                  'BB10431'
                )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-label'),
                  'BB10302'
                )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'aria-labelledby missing',
                'BB10432'
              ),
            'true' === t.getAttribute('contenteditable')
              ? HTMLCS.addMessage(
                  HTMLCS.PASS,
                  t,
                  e.HTMLCS.getAttribute(t, 'contenteditable'),
                  'BB10539'
                )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'Missing contenteditable Attribute',
                  'BB10541'
                )
        },
        checkSwitchState: function (t) {
          'true' === t.getAttribute('aria-pressed') ||
          'false' === t.getAttribute('aria-pressed')
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(t, 'aria-pressed'),
                'BB10435'
              )
            : 'true' === t.getAttribute('aria-checked') ||
              'false' === t.getAttribute('aria-checked')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-checked'),
                'BB10434'
              )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'aria-checked missing',
                'BB10433'
              )
          var a = HTMLCS.util.getCustomElementTextContent(t).trim().length,
            i = t.hasAttribute('aria-label')
          t.hasAttribute('aria-labelledby')
            ? HTMLCS.util.hasValidLabelId(t)
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                  'BB10528'
                )
              : HTMLCS.addMessage(HTMLCS.ERROR, t, 'Missing ID', 'BB10302')
            : 0 < a
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t),
                'BB10528'
              )
            : i
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-label'),
                'BB10528'
              )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'aria-label missing',
                'BB10529'
              ),
            '-1' === t.getAttribute('tabindex') ||
            'true' === t.getAttribute('aria-hidden')
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'tabindex,aria-hidden', !0),
                  'BB10548'
                )
              : 'BUTTON' === t.nodeName || '0' === t.getAttribute('tabindex')
              ? HTMLCS.addMessage(
                  HTMLCS.PASS,
                  t,
                  e.HTMLCS.getAttribute(t, 'tabindex'),
                  'BB10550'
                )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'Missing TabIndex',
                  'BB10549'
                )
        },
        checkRadioState: function (t) {
          'true' === t.getAttribute('aria-pressed') ||
          'false' === t.getAttribute('aria-pressed')
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(t, 'aria-pressed'),
                'BB10436'
              )
            : 'true' === t.getAttribute('aria-checked') ||
              'false' === t.getAttribute('aria-checked')
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-checked'),
                'BB10457'
              )
            : HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                'aria-checked missing',
                'BB10456'
              ),
            '-1' === t.getAttribute('tabindex') ||
            'true' === t.getAttribute('aria-hidden')
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'tabindex,aria-hidden', !0),
                  'BB10535'
                )
              : 'BUTTON' === t.nodeName
              ? HTMLCS.addMessage(HTMLCS.PASS, t, 'Button Element', 'BB10547')
              : '0' === t.getAttribute('tabindex')
              ? HTMLCS.addMessage(
                  HTMLCS.PASS,
                  t,
                  e.HTMLCS.getAttribute(t, 'tabindex'),
                  'BB10547'
                )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'Missing TabIndex',
                  'BB10546'
                ),
            'none' === HTMLCS.util.style(t)?.display ||
            'true' === t.getAttribute('aria-hidden') ||
            '-1' === t.getAttribute('tabindex')
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'tabindex', !1, 'display:none;'),
                  'BB10535'
                )
              : t.hasAttribute('aria-labelledby')
              ? HTMLCS.util.hasValidLabelId(t)
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getAttribute(t, 'aria-labelledby'),
                    'BB10538'
                  )
                : HTMLCS.addMessage(HTMLCS.ERROR, t, 'Missing ID', 'BB10302')
              : t.hasAttribute('aria-label')
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getAttribute(t, 'aria-label'),
                  'BB10538'
                )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  'Missing aria-label',
                  'BB10536'
                )
        },
        checkMultipleNameElements: function (e, t, a) {
          let i = 0,
            n = null
          return (
            'aria-label' == a || 'text' == a
              ? (n = t.getAttribute(a))
              : ((t = t.getAttribute(a)),
                (a = document.getElementById(t)) &&
                  (n = HTMLCS.util.getElementTextContent(a))),
            e.forEach((e) => {
              var t
              let a = null
              e.hasAttribute('aria-labelledby')
                ? ((t = e.getAttribute('aria-labelledby')),
                  (a = (t = document.getElementById(t))
                    ? HTMLCS.util.getElementTextContent(t)
                    : a) === n && i++)
                : e.hasAttribute('aria-label')
                ? (a = e.getAttribute('aria-label')) === n && i++
                : e.hasAttribute('title') &&
                  (a = e.getAttribute('title')) === n &&
                  i++
            }),
            i
          )
        },
        checkSearchTags: function (t) {
          if (0 < t.length) {
            let a = 0
            t.forEach((e) => {
              'none' !== HTMLCS.util.style(e)?.display &&
                'true' !== e.getAttribute('aria-hidden') &&
                'presentation' !== e.getAttribute('role') &&
                'none' !== e.getAttribute('role') &&
                a++
            }),
              t.forEach((i) => {
                'none' === HTMLCS.util.style(i)?.display ||
                'true' === i.getAttribute('aria-hidden') ||
                'presentation' === i.getAttribute('role') ||
                'none' === i.getAttribute('role')
                  ? HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      e.HTMLCS.getAttribute(i, 'role,aria-hidden', !0),
                      'BB10427'
                    )
                  : 1 < a
                  ? i.hasAttribute('aria-label')
                    ? i.hasAttribute('aria-labelledby')
                      ? i.hasAttribute('aria-labelledby')
                        ? HTMLCS.util.hasValidLabelId(i) ||
                          (i.hasAttribute('aria-label')
                            ? this.checkSearchBlankAria(i, t)
                            : HTMLCS.addMessage(
                                HTMLCS.ERROR,
                                i,
                                'Missing ID',
                                'BB10302'
                              ))
                        : (HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            'aria-labelledby missing',
                            'BB10425'
                          ),
                          HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            'aria-labelledby missing',
                            'BB10424'
                          ))
                      : this.checkSearchBlankAria(i, t)
                    : i.hasAttribute('aria-labelledby')
                    ? HTMLCS.util.hasValidLabelId(i)
                      ? 1 <
                        0 +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-label'
                          ) +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'aria-labelledby'
                          ) +
                          e.HTMLCS_SectionBB_Sniffs_Universal.checkMultipleNameElements(
                            t,
                            i,
                            'title'
                          )
                        ? HTMLCS.addMessage(
                            HTMLCS.ERROR,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10515'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            i,
                            e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                            'BB10426'
                          )
                      : i.hasAttribute('aria-label')
                      ? this.checkSearchBlankAria(i, t)
                      : HTMLCS.addMessage(
                          HTMLCS.ERROR,
                          i,
                          'Missing ID',
                          'BB10302'
                        )
                    : (HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        i,
                        'Missing accessible name',
                        'BB10425'
                      ),
                      HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        i,
                        'Missing accessible name',
                        'BB10424'
                      ))
                  : i.hasAttribute('aria-label')
                  ? HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-label'),
                      'BB10492'
                    )
                  : i.hasAttribute('aria-labelledby')
                  ? HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      i,
                      e.HTMLCS.getAttribute(i, 'aria-labelledby'),
                      'BB10493'
                    )
                  : HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      i,
                      'Check accesible name',
                      'BB10424'
                    )
              })
          }
        },
        checkSearchBlankAria: function (t, a) {
          var i
          '' === t.getAttribute('aria-label').trim()
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(t, 'aria-label'),
                'BB10527'
              )
            : (i = 0) <
              (i =
                (i =
                  (i += this.checkMultipleNameElements(a, t, 'aria-label')) +
                  this.checkMultipleNameElements(a, t, 'aria-labelledby')) +
                this.checkMultipleNameElements(a, t, 'title'))
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getAttribute(
                  t,
                  'aria-label,aria-labelledby,title',
                  !0
                ),
                'BB10515'
              )
            : HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                'Accesible Name missing',
                'BB10426'
              )
        },
      }),
      (e.HTMLCS_SectionBB_Sniffs_Video = {
        get register() {
          return ['_top', 'video']
        },
        process: function (e, t) {
          for (let e of HTMLCS.util.getUniversalElements(t, 'video'))
            this.checkVideoTag(e)
        },
        checkVideoTag: function (t) {
          var a
          ;(t.hasAttribute('tabindex') &&
            '-1' === t.getAttribute('tabindex')) ||
          (t.hasAttribute('aria-hidden') &&
            'true' === t.getAttribute('aria-hidden'))
            ? HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getAttribute(t, 'aria-hidden,tabindex', !0),
                'BB10333'
              )
            : (0 < (a = HTMLCS.util.getUniversalElements(t, 'track')).length
                ? a.forEach((e) => {
                    var a = e.getAttribute('src'),
                      e = e.getAttribute('kind').toLowerCase()
                    'captions' === e &&
                    (a.includes('.vtt') || a.includes('.ttml'))
                      ? HTMLCS.addMessage(
                          HTMLCS.WARNING,
                          t,
                          'Caption File Found',
                          'BB10335'
                        )
                      : HTMLCS.addMessage(
                          HTMLCS.WARNING,
                          t,
                          'Caption File Missing',
                          'BB10334'
                        ),
                      'descriptions' === e &&
                      (a.includes('.vtt') || a.includes('.ttml'))
                        ? HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            t,
                            'Check Description',
                            'BB10355'
                          )
                        : HTMLCS.addMessage(
                            HTMLCS.WARNING,
                            t,
                            'No Description Found',
                            'BB10356'
                          )
                  })
                : (HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    'Check Captions',
                    'BB10334'
                  ),
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    'Check Audio Description',
                    'BB10356'
                  )),
              (a = HTMLCS.util.getElementTextContent(document.body)).includes(
                'transcript'
              ) || a.includes('Transcript')
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    'Transcript Found',
                    'BB10316'
                  )
                : HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    'Transcript Missing',
                    'BB10319'
                  ))
        },
      }),
      (e.HTMLCS_WCAG2A = {
        name: 'WCAG2A',
        description: 'Web Content Accessibility Guidelines (WCAG) 2.1 A',
        sniffs: [
          {
            standard: 'WCAG2AAA',
            include: [
              'Principle1.Guideline1_1.1_1_1',
              'Principle1.Guideline1_2.1_2_1',
              'Principle1.Guideline1_2.1_2_2',
              'Principle1.Guideline1_2.1_2_3',
              'Principle1.Guideline1_3.1_3_1',
              'Principle1.Guideline1_3.1_3_1_A',
              'Principle1.Guideline1_3.1_3_2',
              'Principle1.Guideline1_3.1_3_3',
              'Principle1.Guideline1_4.1_4_1',
              'Principle1.Guideline1_4.1_4_2',
              'Principle2.Guideline2_1.2_1_1',
              'Principle2.Guideline2_1.2_1_2',
              'Principle2.Guideline2_1.2_1_4',
              'Principle2.Guideline2_2.2_2_1',
              'Principle2.Guideline2_2.2_2_2',
              'Principle2.Guideline2_3.2_3_1',
              'Principle2.Guideline2_4.2_4_1',
              'Principle2.Guideline2_4.2_4_2',
              'Principle2.Guideline2_4.2_4_3',
              'Principle2.Guideline2_4.2_4_4',
              'Principle2.Guideline2_5.2_5_1',
              'Principle2.Guideline2_5.2_5_2',
              'Principle2.Guideline2_5.2_5_3',
              'Principle2.Guideline2_5.2_5_4',
              'Principle3.Guideline3_1.3_1_1',
              'Principle3.Guideline3_2.3_2_1',
              'Principle3.Guideline3_2.3_2_2',
              'Principle3.Guideline3_3.3_3_1',
              'Principle3.Guideline3_3.3_3_2',
              'Principle4.Guideline4_1.4_1_2',
            ],
          },
        ],
      }),
      (e.HTMLCS_WCAG2AA = {
        name: 'WCAG2AA',
        description: 'Web Content Accessibility Guidelines (WCAG) 2.1 AA',
        sniffs: [
          {
            standard: 'WCAG2AAA',
            include: [
              'Principle1.Guideline1_1.1_1_1',
              'Principle1.Guideline1_2.1_2_1',
              'Principle1.Guideline1_2.1_2_2',
              'Principle1.Guideline1_2.1_2_4',
              'Principle1.Guideline1_2.1_2_5',
              'Principle1.Guideline1_3.1_3_1',
              'Principle1.Guideline1_3.1_3_1_A',
              'Principle1.Guideline1_3.1_3_2',
              'Principle1.Guideline1_3.1_3_3',
              'Principle1.Guideline1_3.1_3_4',
              'Principle1.Guideline1_3.1_3_5',
              'Principle1.Guideline1_4.1_4_1',
              'Principle1.Guideline1_4.1_4_2',
              'Principle1.Guideline1_4.1_4_3',
              'Principle1.Guideline1_4.1_4_3_F24',
              'Principle1.Guideline1_4.1_4_3_Contrast',
              'Principle1.Guideline1_4.1_4_4',
              'Principle1.Guideline1_4.1_4_5',
              'Principle1.Guideline1_4.1_4_10',
              'Principle1.Guideline1_4.1_4_11',
              'Principle1.Guideline1_4.1_4_12',
              'Principle1.Guideline1_4.1_4_13',
              'Principle2.Guideline2_1.2_1_1',
              'Principle2.Guideline2_1.2_1_2',
              'Principle2.Guideline2_1.2_1_4',
              'Principle2.Guideline2_2.2_2_1',
              'Principle2.Guideline2_2.2_2_2',
              'Principle2.Guideline2_3.2_3_1',
              'Principle2.Guideline2_4.2_4_1',
              'Principle2.Guideline2_4.2_4_2',
              'Principle2.Guideline2_4.2_4_3',
              'Principle2.Guideline2_4.2_4_4',
              'Principle2.Guideline2_4.2_4_5',
              'Principle2.Guideline2_4.2_4_6',
              'Principle2.Guideline2_4.2_4_7',
              'Principle2.Guideline2_5.2_5_1',
              'Principle2.Guideline2_5.2_5_2',
              'Principle2.Guideline2_5.2_5_3',
              'Principle2.Guideline2_5.2_5_4',
              'Principle3.Guideline3_1.3_1_1',
              'Principle3.Guideline3_1.3_1_2',
              'Principle3.Guideline3_2.3_2_1',
              'Principle3.Guideline3_2.3_2_2',
              'Principle3.Guideline3_2.3_2_3',
              'Principle3.Guideline3_2.3_2_4',
              'Principle3.Guideline3_3.3_3_1',
              'Principle3.Guideline3_3.3_3_2',
              'Principle3.Guideline3_3.3_3_3',
              'Principle3.Guideline3_3.3_3_4',
              'Principle4.Guideline4_1.4_1_2',
              'Principle4.Guideline4_1.4_1_3',
            ],
          },
        ],
      }),
      (e.HTMLCS_WCAG2AAA = {
        name: 'WCAG2AAA',
        description: 'Web Content Accessibility Guidelines (WCAG) 2.1 AAA',
        sniffs: [
          'Principle1.Guideline1_1.1_1_1',
          'Principle1.Guideline1_2.1_2_1',
          'Principle1.Guideline1_2.1_2_2',
          'Principle1.Guideline1_2.1_2_4',
          'Principle1.Guideline1_2.1_2_5',
          'Principle1.Guideline1_2.1_2_6',
          'Principle1.Guideline1_2.1_2_7',
          'Principle1.Guideline1_2.1_2_8',
          'Principle1.Guideline1_2.1_2_9',
          'Principle1.Guideline1_3.1_3_1',
          'Principle1.Guideline1_3.1_3_1_AAA',
          'Principle1.Guideline1_3.1_3_2',
          'Principle1.Guideline1_3.1_3_3',
          'Principle1.Guideline1_3.1_3_4',
          'Principle1.Guideline1_3.1_3_5',
          'Principle1.Guideline1_3.1_3_6',
          'Principle1.Guideline1_4.1_4_1',
          'Principle1.Guideline1_4.1_4_2',
          'Principle1.Guideline1_4.1_4_3_F24',
          'Principle1.Guideline1_4.1_4_3_Contrast',
          'Principle1.Guideline1_4.1_4_6',
          'Principle1.Guideline1_4.1_4_7',
          'Principle1.Guideline1_4.1_4_8',
          'Principle1.Guideline1_4.1_4_9',
          'Principle1.Guideline1_4.1_4_10',
          'Principle1.Guideline1_4.1_4_11',
          'Principle1.Guideline1_4.1_4_12',
          'Principle1.Guideline1_4.1_4_13',
          'Principle2.Guideline2_1.2_1_1',
          'Principle2.Guideline2_1.2_1_2',
          'Principle2.Guideline2_1.2_1_4',
          'Principle2.Guideline2_2.2_2_2',
          'Principle2.Guideline2_2.2_2_3',
          'Principle2.Guideline2_2.2_2_4',
          'Principle2.Guideline2_2.2_2_5',
          'Principle2.Guideline2_2.2_2_6',
          'Principle2.Guideline2_3.2_3_2',
          'Principle2.Guideline2_3.2_3_3',
          'Principle2.Guideline2_4.2_4_1',
          'Principle2.Guideline2_4.2_4_2',
          'Principle2.Guideline2_4.2_4_3',
          'Principle2.Guideline2_4.2_4_5',
          'Principle2.Guideline2_4.2_4_6',
          'Principle2.Guideline2_4.2_4_7',
          'Principle2.Guideline2_4.2_4_8',
          'Principle2.Guideline2_4.2_4_9',
          'Principle2.Guideline2_5.2_5_1',
          'Principle2.Guideline2_5.2_5_2',
          'Principle2.Guideline2_5.2_5_3',
          'Principle2.Guideline2_5.2_5_4',
          'Principle2.Guideline2_5.2_5_5',
          'Principle2.Guideline2_5.2_5_6',
          'Principle3.Guideline3_1.3_1_1',
          'Principle3.Guideline3_1.3_1_2',
          'Principle3.Guideline3_1.3_1_3',
          'Principle3.Guideline3_1.3_1_4',
          'Principle3.Guideline3_1.3_1_5',
          'Principle3.Guideline3_1.3_1_6',
          'Principle3.Guideline3_2.3_2_1',
          'Principle3.Guideline3_2.3_2_2',
          'Principle3.Guideline3_2.3_2_3',
          'Principle3.Guideline3_2.3_2_4',
          'Principle3.Guideline3_2.3_2_5',
          'Principle3.Guideline3_3.3_3_1',
          'Principle3.Guideline3_3.3_3_2',
          'Principle3.Guideline3_3.3_3_3',
          'Principle3.Guideline3_3.3_3_5',
          'Principle3.Guideline3_3.3_3_6',
          'Principle4.Guideline4_1.4_1_2',
          'Principle4.Guideline4_1.4_1_3',
        ],
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_1_1_1_1 = {
        get register() {
          return ['_top', 'img']
        },
        process: function (e, t) {
          e === t
            ? (this.addNullAltTextResults(t),
              this.addMediaAlternativesResults(t))
            : 'IMG' === e.nodeName &&
              (this.testLinkStutter(e), this.testLongdesc(e))
        },
        addNullAltTextResults: function (t) {
          for (let a of (t = this.testNullAltText(t)).img.emptyAltInLink)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('1_1_1_H30.2'),
              'H30.2'
            )
          for (let a of t.img.nullAltWithTitle)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('1_1_1_H67.1'),
              'H67.1'
            )
          for (let a of t.img.ignored)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              a,
              e.HTMLCS.getTranslation('1_1_1_H67.2'),
              'H67.2'
            )
          for (let a of t.img.missingAlt)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('1_1_1_H37'),
              'H37'
            )
          for (let a of t.img.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_1_1_G94.Image'),
              'G94.Image'
            )
          for (let a of t.inputImage.missingAlt)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('1_1_1_H36'),
              'H36'
            )
          for (let a of t.inputImage.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_1_1_G94.Button'),
              'G94.Button'
            )
          for (let a of t.area.missingAlt)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('1_1_1_H24'),
              'H24'
            )
          for (let a of t.area.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_1_1_H24.2'),
              'H24.2'
            )
        },
        testNullAltText: function (e) {
          var t = {
            img: {
              generalAlt: [],
              missingAlt: [],
              ignored: [],
              nullAltWithTitle: [],
              emptyAltInLink: [],
            },
            inputImage: {generalAlt: [], missingAlt: []},
            area: {generalAlt: [], missingAlt: []},
          }
          for (let a of HTMLCS.util.getAllElements(
            e,
            'img, area, input[type="image"]'
          )) {
            let e = !1,
              i = !1,
              n = !1
            if (
              'A' === a.parentNode.nodeName &&
              null === HTMLCS.util.getPreviousSiblingElement(a, null) &&
              null === HTMLCS.util.getNextSiblingElement(a, null)
            ) {
              let t = a.parentNode.textContent
              ;(t =
                void 0 !== a.parentNode.textContent
                  ? a.parentNode.textContent
                  : a.parentNode.innerText),
                !0 === HTMLCS.util.isStringEmpty(t) && (e = !0)
            }
            switch (
              (!1 === a.hasAttribute('alt')
                ? (i = !0)
                : (a.getAttribute('alt') &&
                    !0 !== HTMLCS.util.isStringEmpty(a.getAttribute('alt'))) ||
                  (n = !0),
              a.nodeName)
            ) {
              case 'IMG':
                !0 !== e || (!0 !== i && !0 !== n)
                  ? (!0 === i
                      ? t.img.missingAlt
                      : !0 === n
                      ? !0 === a.hasAttribute('title') &&
                        !1 ===
                          HTMLCS.util.isStringEmpty(a.getAttribute('title'))
                        ? t.img.nullAltWithTitle
                        : t.img.ignored
                      : t.img.generalAlt
                    ).push(a)
                  : t.img.emptyAltInLink.push(a.parentNode)
                break
              case 'INPUT':
                ;(!0 === i || !0 === n
                  ? t.inputImage.missingAlt
                  : t.inputImage.generalAlt
                ).push(a)
                break
              case 'AREA':
                ;(!0 === i || !0 === n
                  ? t.area.missingAlt
                  : t.inputImage.generalAlt
                ).push(a)
            }
          }
          return t
        },
        testLongdesc: (t) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_1_1_G73,G74'),
            'G73,G74'
          ),
        testLinkStutter: function (t) {
          var a, i, n
          t.parentNode &&
            'A' === t.parentNode.nodeName &&
            (null ===
              (a = {
                anchor: {
                  href: (n = t.parentNode).getAttribute('href'),
                  text: HTMLCS.util.getElementTextContent(n, !1),
                  alt: this._getLinkAltText(n),
                },
                previous: void 0,
                next: void 0,
              }).anchor.alt && (a.anchor.alt = ''),
            null !== a.anchor.alt &&
              '' !== a.anchor.alt &&
              a.anchor.alt.trim().toLowerCase() ===
                a.anchor.text.trim().toLowerCase() &&
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getTranslation('1_1_1_H2.EG5'),
                'H2.EG5'
              ),
            '' === a.anchor.text) &&
            ((i = HTMLCS.util.getPreviousSiblingElement(n, 'A', !0)),
            (n = HTMLCS.util.getNextSiblingElement(n, 'A', !0)),
            null !== i &&
              ((a.previous = {
                href: i.getAttribute('href'),
                text: HTMLCS.util.getElementTextContent(i, !1),
                alt: this._getLinkAltText(i),
              }),
              null === a.previous.alt) &&
              (a.previous.alt = ''),
            null !== n &&
              ((a.next = {
                href: n.getAttribute('href'),
                text: HTMLCS.util.getElementTextContent(n, !1),
                alt: this._getLinkAltText(n),
              }),
              null === a.next.alt) &&
              (a.next.alt = ''),
            a.next &&
              a.next.href &&
              a.anchor.href === a.next.href &&
              ('' !== a.next.text && '' === a.anchor.alt
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getTranslation('1_1_1_H2.EG4'),
                    'H2.EG4'
                  )
                : a.next.text.toLowerCase() === a.anchor.alt.toLowerCase() &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getTranslation('1_1_1_H2.EG3'),
                    'H2.EG3'
                  )),
            a.previous) &&
            '' !== a.previous.href &&
            null !== a.previous.href &&
            a.anchor.href === a.previous.href &&
            ('' !== a.previous.text && '' === a.anchor.alt
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('1_1_1_H2.EG4'),
                  'H2.EG4'
                )
              : a.previous.text.toLowerCase() === a.anchor.alt.toLowerCase() &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('1_1_1_H2.EG3'),
                  'H2.EG3'
                ))
        },
        addMediaAlternativesResults: function (t) {
          for (let a of (t = this.testMediaTextAlternatives(t)).object
            .missingBody)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('1_1_1_H53,ARIA6'),
              'H53,ARIA6'
            )
          for (let a of t.object.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_1_1_G94,G92.Object,ARIA6'),
              'G94,G92.Object,ARIA6'
            )
          for (let a of t.applet.missingBody)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('1_1_1_H35.3'),
              'H35.3'
            )
          for (let a of t.applet.missingAlt)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('1_1_1_H35.2'),
              'H35.2'
            )
          for (let a of t.applet.generalAlt)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_1_1_G94,G92.Applet'),
              'G94,G92.Applet'
            )
        },
        testMediaTextAlternatives: function (e) {
          var t = {
            object: {missingBody: [], generalAlt: []},
            applet: {missingBody: [], missingAlt: [], generalAlt: []},
          }
          for (let a of HTMLCS.util.getAllElements(e, 'object'))
            null === a.querySelector('object') &&
              (!0 ===
              HTMLCS.util.isStringEmpty(
                HTMLCS.util.getElementTextContent(a, !0)
              )
                ? !1 === HTMLCS.util.hasValidAriaLabel(a) &&
                  t.object.missingBody.push(a)
                : !1 === HTMLCS.util.hasValidAriaLabel(a) &&
                  t.object.generalAlt.push(a))
          for (let a of HTMLCS.util.getAllElements(e, 'applet')) {
            let e = !1
            null === a.querySelector('object') &&
              !0 ===
                HTMLCS.util.isStringEmpty(
                  HTMLCS.util.getElementTextContent(a, !0)
                ) &&
              (t.applet.missingBody.push(a), (e = !0)),
              !0 === HTMLCS.util.isStringEmpty(a.getAttribute('alt') || '') &&
                (t.applet.missingAlt.push(a), (e = !0)),
              !1 === (e = !0 !== HTMLCS.util.hasValidAriaLabel(a) && e) &&
                t.applet.generalAlt.push(a)
          }
          return t
        },
        _getLinkAltText: function (e) {
          let t = null
          for (let a of e.childNodes)
            if (
              1 === a.nodeType &&
              'IMG' === a.nodeName &&
              a.hasAttribute('alt')
            ) {
              t = (t = a.getAttribute('alt')) ? t.replace(/^\s+|\s+$/g, '') : ''
              break
            }
          return t
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_1 = {
        get register() {
          return ['object', 'embed', 'applet', 'bgsound', 'audio', 'video']
        },
        process: (t, a) => {
          var i = t.nodeName
          'VIDEO' !== i &&
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              e.HTMLCS.getTranslation('1_2_1_G158'),
              'G158'
            ),
            'BGSOUND' !== i &&
              'AUDIO' !== i &&
              HTMLCS.addMessage(
                HTMLCS.NOTICE,
                t,
                e.HTMLCS.getTranslation('1_2_1_G159,G166'),
                'G159,G166'
              )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_2 = {
        get register() {
          return ['object', 'embed', 'applet', 'video']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_2_2_G87,G93'),
            'G87,G93'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_3 = {
        get register() {
          return ['object', 'embed', 'applet', 'video']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_2_3_G69,G78,G173,G8'),
            'G69,G78,G173,G8'
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_4 = {
        get register() {
          return ['object', 'embed', 'applet', 'video']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_2_4_G9,G87,G93'),
            'G9,G87,G93'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_5 = {
        get register() {
          return ['object', 'embed', 'applet', 'video']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_2_5_G78,G173,G8'),
            'G78,G173,G8'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_6 = {
        get register() {
          return ['object', 'embed', 'applet', 'video']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_2_6_G54,G81'),
            'G54,G81'
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_7 = {
        get register() {
          return ['object', 'embed', 'applet', 'video']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_2_7_G8'),
            'G8'
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_8 = {
        get register() {
          return ['object', 'embed', 'applet', 'video']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_2_8_G69,G159'),
            'G69,G159'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_2_1_2_9 = {
        get register() {
          return ['object', 'embed', 'applet', 'bgsound', 'audio']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_2_9_G150,G151,G157'),
            'G150,G151,G157'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_1_A = {
        _labelNames: null,
        get register() {
          return ['_top']
        },
        process: (e, t) => {
          e === t &&
            HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_1.testHeadingOrder(
              t,
              HTMLCS.ERROR
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_1_AAA = {
        _labelNames: null,
        get register() {
          return ['_top']
        },
        process: (e, t) => {
          e === t &&
            HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_1.testHeadingOrder(
              t,
              HTMLCS.ERROR
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_1 = {
        _labelNames: null,
        get register() {
          return [
            '_top',
            'p',
            'div',
            'input',
            'select',
            'textarea',
            'button',
            'table',
            'fieldset',
            'form',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
          ]
        },
        process: function (e, t) {
          var a = e.nodeName
          if (e === t)
            this.testPresentationMarkup(t), this.testEmptyDupeLabelForAttrs(t)
          else
            switch (a) {
              case 'INPUT':
              case 'TEXTAREA':
              case 'BUTTON':
                this.testLabelsOnInputs(e, t)
                break
              case 'FORM':
                this.testRequiredFieldsets(e)
                break
              case 'SELECT':
                this.testLabelsOnInputs(e, t), this.testOptgroup(e)
                break
              case 'P':
              case 'DIV':
                this.testNonSemanticHeading(e),
                  this.testListsWithBreaks(e),
                  this.testUnstructuredNavLinks(e)
                break
              case 'TABLE':
                this.testGeneralTable(e),
                  this.testTableHeaders(e),
                  this.testTableCaptionSummary(e)
                break
              case 'FIELDSET':
                this.testFieldsetLegend(e)
                break
              case 'H1':
              case 'H2':
              case 'H3':
              case 'H4':
              case 'H5':
              case 'H6':
                this.testEmptyHeading(e)
            }
        },
        testSemanticPresentationRole: function (t) {
          if (
            !HTMLCS.util.isAriaHidden(t) &&
            t.hasAttribute('role') &&
            'presentation' === t.getAttribute('role') &&
            'DIV' !== t.nodeName &&
            'SPAN' !== t.nodeName &&
            'B' !== t.nodeName &&
            'I' !== t.nodeName
          ) {
            var a = t.querySelectorAll('*:not(div):not(span):not(b):not(i)'),
              i = Array(a.length)
            let n = 0
            for (let e of a) e.hasAttribute('role') || ((i[n] = e), n++)
            ;(i.length = n) &&
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getTranslation('1_3_1_F92,ARIA4'),
                'F92,ARIA4'
              )
          }
        },
        testEmptyDupeLabelForAttrs: function (t) {
          this._labelNames = {}
          let a = null
          for (let n of t.getElementsByTagName('label')) {
            var i = n.getAttribute('for')
            if (null !== i && '' !== i) {
              if (this._labelNames[i] && null !== this._labelNames[i])
                this._labelNames[i] = null
              else if (
                ((this._labelNames[i] = n),
                null === (a = (t.ownerDocument || t).getElementById(i)))
              ) {
                let a = HTMLCS.ERROR,
                  i = e.HTMLCS.getTranslation('1_3_1_H44.NonExistent'),
                  s = 'H44.NonExistent'
                ;(!0 !== HTMLCS.isFullDoc(t) && 'BODY' !== t.nodeName) ||
                  ((a = HTMLCS.WARNING),
                  (i = e.HTMLCS.getTranslation(
                    '1_3_1_H44.NonExistentFragment'
                  )),
                  (s = 'H44.NonExistentFragment')),
                  HTMLCS.addMessage(a, n, i, s)
              } else
                'INPUT' !== (i = a && a.nodeName) &&
                  'SELECT' !== i &&
                  'TEXTAREA' !== i &&
                  'BUTTON' !== i &&
                  'KEYGEN' !== i &&
                  'METER' !== i &&
                  'OUTPUT' !== i &&
                  'PROGRESS' !== i &&
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    n,
                    e.HTMLCS.getTranslation('1_3_1_H44.NotFormControl'),
                    'H44.NotFormControl'
                  )
            }
          }
        },
        testLabelsOnInputs: function (t, a, i) {
          let n = t.nodeName,
            s =
              ('INPUT' === n &&
                (n = t.hasAttribute('type')
                  ? t.getAttribute('type').toLowerCase()
                  : 'text'),
              !1)
          function r(e) {
            ;(s = s || {})[e] = !0
          }
          let l = !1,
            o =
              (('select' === n ||
                'textarea' === n ||
                !0 === /^(radio|checkbox|text|file|password)$/.test(n)) &&
                (l = !0),
              null !== t.getAttribute('hidden') && (l = !1),
              t.ownerDocument.querySelector('label[for="' + t.id + '"]') &&
                r('explicit'),
              !1)
          return (
            t.parentNode &&
              HTMLCS.util.eachParentNode(t, function (e) {
                return (o = 'LABEL' === e.nodeName || o)
              }),
            o && r('implicit'),
            t.hasAttribute('title') &&
              (!0 === /^\s*$/.test(t.getAttribute('title')) && l
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_H65'),
                    'H65'
                  )
                : r('title')),
            t.hasAttribute('aria-label') &&
              (HTMLCS.util.hasValidAriaLabel(t)
                ? r('aria-label')
                : HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_ARIA6'),
                    'ARIA6'
                  )),
            t.hasAttribute('aria-labelledby') &&
              (HTMLCS.util.hasValidAriaLabel(t)
                ? r('aria-labelledby')
                : HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_ARIA16,ARIA9').replace(
                      /\{\{id\}\}/g,
                      t.getAttribute('aria-labelledby')
                    ),
                    'ARIA16,ARIA9'
                  )),
            !0 !== i &&
              (!1 === s || l
                ? !1 === s &&
                  l &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_F68'),
                    'F68'
                  )
                : 'hidden' === n
                ? HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_F68.Hidden'),
                    'F68.Hidden'
                  )
                : null !== t.getAttribute('hidden') &&
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_F68.HiddenAttr'),
                    'F68.HiddenAttr'
                  )),
            s
          )
        },
        testPresentationMarkup: (t) => {
          var a = HTMLCS.util.getDocumentType(
            HTMLCS.util.getElementWindow(t).document
          )
          if (a && ('html5' === a || 'xhtml5' === a)) {
            for (let a of HTMLCS.util.getAllElements(
              t,
              'strike, tt, big, center, font'
            ))
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                a,
                e.HTMLCS.getTranslation('1_3_1_H49.'),
                'H49.' +
                  a.nodeName.substring(0, 1).toUpperCase() +
                  a.nodeName.substring(1).toLowerCase()
              )
            for (let e of HTMLCS.util.getAllElements(t, '*[align]'))
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                e,
                'Align attributes .',
                'H49.AlignAttr'
              )
          } else {
            for (let a of HTMLCS.util.getAllElements(
              t,
              'b, i, u, s, strike, tt, big, small, center, font'
            ))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                a,
                e.HTMLCS.getTranslation('1_3_1_H49.Semantic'),
                'H49.' +
                  a.nodeName.substring(0, 1).toUpperCase() +
                  a.nodeName.substring(1).toLowerCase()
              )
            for (let a of HTMLCS.util.getAllElements(t, '*[align]'))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                a,
                e.HTMLCS.getTranslation('1_3_1_H49.AlignAttr.Semantic'),
                'H49.AlignAttr'
              )
          }
        },
        testNonSemanticHeading: function (t) {
          var a = t.nodeName
          ;('P' !== a && 'DIV' !== a) ||
            (1 === (a = t.childNodes).length &&
              1 === a[0].nodeType &&
              !0 === /^(STRONG|EM|B|I|U)$/.test(a[0].nodeName) &&
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('1_3_1_H42'),
                'H42'
              ))
        },
        testTableHeaders: function (t) {
          let a = this._testTableScopeAttrs(t)
          for (let t of a.invalid)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              e.HTMLCS.getTranslation('1_3_1_H63.3'),
              'H63.3'
            )
          for (let t of a.obsoleteTd)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              e.HTMLCS.getTranslation('1_3_1_H63.2'),
              'H63.2'
            )
          var i = HTMLCS.util.testTableHeaders(t)
          if (
            (i.allowScope
              ? 0 === a.missing.length && i.required
              : !0 === a.used &&
                (HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getTranslation('1_3_1_H43.ScopeAmbiguous'),
                  'H43.ScopeAmbiguous'
                ),
                (a = null)),
            i.isMultiLevelHeadersTable)
          )
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              e.HTMLCS.getTranslation('1_3_1_H43.IncorrectAttrNotice'),
              'H43.IncorrectAttr'
            )
          else
            for (let t of i.wrongHeaders)
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                t.element,
                e.HTMLCS.getTranslation('1_3_1_H43.IncorrectAttr')
                  .replace(/\{\{expected\}\}/g, t.expected)
                  .replace(/\{\{actual\}\}/g, t.actual),
                'H43.IncorrectAttr'
              )
          i.required &&
            !i.allowScope &&
            (i.used
              ? (0 < i.missingThId.length &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_H43.MissingHeaderIds'),
                    'H43.MissingHeaderIds'
                  ),
                0 < i.missingTd.length &&
                  HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_H43.MissingHeadersAttrs'),
                    'H43.MissingHeadersAttrs'
                  ))
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('1_3_1_H43.HeadersRequired'),
                  'H43.HeadersRequired'
                )),
            !0 === i.required &&
              !0 === i.allowScope &&
              !1 === i.correct &&
              !1 === a.correct &&
              (a.used || i.used
                ? !a.used &&
                  (0 < i.missingThId.length || 0 < i.missingTd.length)
                  ? (0 < i.missingThId.length &&
                      HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        e.HTMLCS.getTranslation('1_3_1_H43.MissingHeaderIds'),
                        'H43.MissingHeaderIds'
                      ),
                    0 < i.missingTd.length &&
                      HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        e.HTMLCS.getTranslation(
                          '1_3_1_H43.MissingHeadersAttrs'
                        ),
                        'H43.MissingHeadersAttrs'
                      ))
                  : 0 < a.missing.length && !1 === i.used
                  ? HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      e.HTMLCS.getTranslation('1_3_1_H63.1'),
                      'H63.1'
                    )
                  : 0 < a.missing.length &&
                    (0 < i.missingThId.length || 0 < i.missingTd.length) &&
                    HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      e.HTMLCS.getTranslation('1_3_1_H43,H63'),
                      'H43,H63'
                    )
                : HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_H43,H63'),
                    'H43,H63'
                  ))
        },
        _testTableScopeAttrs: function (e) {
          var t = {
              th: e.getElementsByTagName('th'),
              td: e.getElementsByTagName('td'),
            },
            a = {
              used: !1,
              correct: !0,
              missing: [],
              invalid: [],
              obsoleteTd: [],
            }
          for (let e in t)
            for (let i of t[e]) {
              let e = ''
              !0 === i.hasAttribute('scope') &&
                ((a.used = !0), i.getAttribute('scope')) &&
                (e = i.getAttribute('scope')),
                'TH' === i.nodeName
                  ? /^\s*$/.test(e)
                    ? ((a.correct = !1), a.missing.push(i))
                    : !1 === /^(row|col|rowgroup|colgroup)$/.test(e) &&
                      ((a.correct = !1), a.invalid.push(i))
                  : '' !== e &&
                    (a.obsoleteTd.push(i),
                    !1 === /^(row|col|rowgroup|colgroup)$/.test(e)) &&
                    ((a.correct = !1), a.invalid.push(i))
            }
          return a
        },
        testTableCaptionSummary: function (t) {
          var a = t.getElementsByTagName('caption')
          let i = t.getAttribute('summary') || '',
            n = ''
          0 < a.length && (n = a[0].innerHTML.replace(/^\s*(.*?)\s*$/g, '$1')),
            (a = HTMLCS.util.getDocumentType(t.ownerDocument)) &&
              -1 === a.indexOf('html5') &&
              ('' !== (i = i.replace(/^\s*(.*?)\s*$/g, '$1'))
                ? !0 === HTMLCS.util.isLayoutTable(t)
                  ? HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      t,
                      e.HTMLCS.getTranslation('1_3_1_H73.3.LayoutTable'),
                      'H73.3.LayoutTable'
                    )
                  : (n === i &&
                      HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        e.HTMLCS.getTranslation('1_3_1_H39,H73.4'),
                        'H39,H73.4'
                      ),
                    HTMLCS.addMessage(
                      HTMLCS.NOTICE,
                      t,
                      e.HTMLCS.getTranslation('1_3_1_H73.3.Check'),
                      'H73.3.Check'
                    ))
                : !1 === HTMLCS.util.isLayoutTable(t) &&
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_H73.3.NoSummary'),
                    'H73.3.NoSummary'
                  )),
            '' !== n
              ? !0 === HTMLCS.util.isLayoutTable(t)
                ? HTMLCS.addMessage(
                    HTMLCS.ERROR,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_H39.3.LayoutTable'),
                    'H39.3.LayoutTable'
                  )
                : HTMLCS.addMessage(
                    HTMLCS.NOTICE,
                    t,
                    e.HTMLCS.getTranslation('1_3_1_H39.3.Check'),
                    'H39.3.Check'
                  )
              : !1 === HTMLCS.util.isLayoutTable(t) &&
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getTranslation('1_3_1_H39.3.NoCaption'),
                  'H39.3.NoCaption'
                )
        },
        testFieldsetLegend: function (t) {
          var a = t.querySelector('legend')
          ;(null !== a && a.parentNode === t) ||
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              e.HTMLCS.getTranslation('1_3_1_H71.NoLegend'),
              'H71.NoLegend'
            )
        },
        testOptgroup: function (t) {
          null === t.querySelector('optgroup') &&
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              e.HTMLCS.getTranslation('1_3_1_H85.2'),
              'H85.2'
            )
        },
        testRequiredFieldsets: function (t) {
          var a = {}
          for (let i of t.querySelectorAll(
            'input[type=radio], input[type=checkbox]'
          )) {
            let n = null,
              s = null
            if (i.hasAttribute('name')) {
              for (
                s = i.getAttribute('name'), n = i.parentNode;
                'FIELDSET' !== n.nodeName && null !== n && n !== t;

              )
                n = n.parentNode
              'FIELDSET' !== n.nodeName && (n = null)
            }
            if (void 0 === a[s]) a[s] = n
            else if (null === n || n !== a[s]) {
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('1_3_1_H71.SameName'),
                'H71.SameName'
              )
              break
            }
          }
        },
        testListsWithBreaks: function (t) {
          var a = []
          if (null !== t.querySelector('br')) {
            var i = []
            for (let e of t.childNodes) i.push(e)
            let s = []
            for (; 0 < i.length; ) {
              var n = i.shift()
              if (1 === n.nodeType) {
                if ('BR' === n.nodeName)
                  a.push(s.join(' ').replace(/^\s*(.*?)\s*$/g, '$1')), (s = [])
                else
                  for (let e = n.childNodes.length - 1; 0 <= e; --e)
                    i.unshift(n.childNodes[e])
              } else 3 === n.nodeType && s.push(n.nodeValue)
            }
            for (let i of (0 < s.length &&
              a.push(s.join(' ').replace(/^\s*(.*?)\s*$/g, '$1')),
            a)) {
              if (!0 === /^[-*]\s+/.test(i)) {
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getTranslation('1_3_1_H48.1'),
                  'H48.1'
                )
                break
              }
              if (!0 === /^\d+[:/\-.]?\s+/.test(i)) {
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getTranslation('1_3_1_H48.2'),
                  'H48.2'
                )
                break
              }
            }
          }
        },
        testHeadingOrder: function (t, a) {
          let i = 0
          for (let r of HTMLCS.util.getAllElements(
            t,
            'h1, h2, h3, h4, h5, h6'
          )) {
            var n = parseInt(r.nodeName.substring(1)),
              s = n + ''
            1 < n - i &&
              (0 === i &&
                HTMLCS.addMessage(
                  a,
                  r,
                  e.HTMLCS.getTranslation('1_3_1_G141_a').replace(
                    /\{\{headingNum\}\}/g,
                    s
                  ),
                  'G141'
                ),
              HTMLCS.addMessage(
                a,
                r,
                e.HTMLCS.getTranslation('1_3_1_G141_b')
                  .replace(/\{\{headingNum\}\}/g, s)
                  .replace(/\{\{properHeadingNum\}\}/g, i + 1 + ''),
                'G141'
              )),
              (i = n)
          }
        },
        testEmptyHeading: function (t) {
          !0 === /^\s*$/.test(HTMLCS.util.getElementTextContent(t, !0)) &&
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              e.HTMLCS.getTranslation('1_3_1_H42.2'),
              'H42.2'
            )
        },
        testUnstructuredNavLinks: function (t) {
          let a = 0
          for (let e of t.childNodes)
            if (1 === e.nodeType && 'A' === e.nodeName) {
              a++
              break
            }
          if (a) {
            let a = t.parentNode
            for (; null !== a && 'UL' !== a.nodeName && 'OL' !== a.nodeName; )
              a = a.parentNode
            null === a &&
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('1_3_1_H48'),
                'H48'
              )
          }
        },
        testGeneralTable: function (t) {
          !0 === HTMLCS.util.isLayoutTable(t)
            ? HTMLCS.addMessage(
                HTMLCS.NOTICE,
                t,
                e.HTMLCS.getTranslation('1_3_1_LayoutTable'),
                'LayoutTable'
              )
            : HTMLCS.addMessage(
                HTMLCS.NOTICE,
                t,
                e.HTMLCS.getTranslation('1_3_1_DataTable'),
                'DataTable'
              )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_2 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_3_2_G57'),
            'G57'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_3 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_3_3_G96'),
            'G96'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_4 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_3_4.RestrictView'),
            ''
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_5 = {
        get register() {
          return ['_top', 'input', 'select', 'textarea']
        },
        checkValidAttributes: (t) => {
          var a = t.getAttribute('autocomplete')
          if ('string' == typeof a) {
            var i = [
              'additional-name',
              'address-level1',
              'address-level2',
              'address-level3',
              'address-level4',
              'address-line1',
              'address-line2',
              'address-line3',
              'bday',
              'bday-year',
              'bday-day',
              'bday-month',
              'billing',
              'cc-additional-name',
              'cc-csc',
              'cc-exp',
              'cc-exp-month',
              'cc-exp-year',
              'cc-family-name',
              'cc-given-name',
              'cc-name',
              'cc-number',
              'cc-type',
              'country',
              'country-name',
              'current-password',
              'email',
              'family-name',
              'fax',
              'given-name',
              'home',
              'honorific-prefix',
              'honorific-suffix',
              'impp',
              'language',
              'mobile',
              'name',
              'new-password',
              'nickname',
              'off',
              'on',
              'organization',
              'organization-title',
              'pager',
              'photo',
              'postal-code',
              'sex',
              'shipping',
              'street-address',
              'tel-area-code',
              'tel',
              'tel-country-code',
              'tel-extension',
              'tel-local',
              'tel-local-prefix',
              'tel-local-suffix',
              'tel-national',
              'transaction-amount',
              'transaction-currency',
              'url',
              'username',
              'work',
            ]
            let s = !1
            for (let e of a.split(' ')) {
              var n = e.trim()
              ;-1 === i.indexOf(n) && 0 !== n.indexOf('section-') && (s = !0)
            }
            s &&
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('1_3_5_H98.FaultyValue').replace(
                  /\{\{valuesStr\}\}/g,
                  a
                ),
                'H98'
              )
          }
        },
        checkControlGroups: (t) => {
          var a = [
              'name',
              'honorific-prefix',
              'given-name',
              'additional-name',
              'family-name',
              'honorific-suffix',
              'nickname',
              'organization-title',
              'username',
              'organization',
              'address-line1',
              'address-line2',
              'address-line3',
              'address-level4',
              'address-level3',
              'address-level2',
              'address-level1',
              'country',
              'country-name',
              'postal-code',
              'cc-name',
              'cc-given-name',
              'cc-additional-name',
              'cc-family-name',
              'cc-number',
              'cc-csc',
              'cc-type',
              'transaction-currency',
              'language',
              'sex',
              'tel-country-code',
              'tel-national',
              'tel-area-code',
              'tel-local',
              'tel-local-prefix',
              'tel-local-suffix',
              'tel-extension',
            ],
            i =
              ('INPUT' === t.tagName && 'hidden' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'text' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'search' === t.getAttribute('type')) ||
              'TEXTAREA' === t.tagName ||
              'SELECT' === t.tagName,
            n = ['street-address'],
            s =
              ('INPUT' === t.tagName && 'hidden' === t.getAttribute('type')) ||
              'TEXTAREA' === t.tagName ||
              'SELECT' === t.tagName,
            r = ['new-password', 'current-password'],
            l =
              ('INPUT' === t.tagName && 'hidden' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'text' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'search' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName &&
                'password' === t.getAttribute('type')) ||
              'TEXTAREA' === t.tagName ||
              'SELECT' === t.tagName,
            o = ['url', 'photo', 'impp'],
            d =
              ('INPUT' === t.tagName && 'hidden' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'text' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'search' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'email' === t.getAttribute('type')) ||
              'TEXTAREA' === t.tagName ||
              'SELECT' === t.tagName,
            u = ['tel'],
            g =
              ('INPUT' === t.tagName && 'hidden' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'text' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'search' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'tel' === t.getAttribute('type')) ||
              'TEXTAREA' === t.tagName ||
              'SELECT' === t.tagName,
            c = [
              'cc-exp-month',
              'cc-exp-year',
              'transaction-amount',
              'bday-day',
              'bday-month',
              'bday-year',
            ],
            _ =
              ('INPUT' === t.tagName && 'hidden' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'text' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'search' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'number' === t.getAttribute('type')) ||
              'TEXTAREA' === t.tagName ||
              'SELECT' === t.tagName,
            T = ['cc-exp'],
            M =
              ('INPUT' === t.tagName && 'hidden' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'text' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'search' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'month' === t.getAttribute('type')) ||
              'TEXTAREA' === t.tagName ||
              'SELECT' === t.tagName,
            C = ['bday'],
            h =
              ('INPUT' === t.tagName && 'hidden' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'text' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'search' === t.getAttribute('type')) ||
              ('INPUT' === t.tagName && 'date' === t.getAttribute('type')) ||
              'TEXTAREA' === t.tagName ||
              'SELECT' === t.tagName
          for (let H of t.getAttribute('autocomplete').split(' ')) {
            var S = H.trim()
            ;-1 < a.indexOf(S) &&
              !i &&
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getTranslation(
                  '1_3_5_H98.InvalidAutoComplete_Text'
                ).replace(/\{\{x\}\}/g, S),
                'H98'
              ),
              -1 < n.indexOf(S) &&
                !s &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation(
                    '1_3_5_H98.InvalidAutoComplete_Multiline'
                  ).replace(/\{\{x\}\}/g, S),
                  'H98'
                ),
              -1 < r.indexOf(S) &&
                !l &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation(
                    '1_3_5_H98.InvalidAutoComplete_Password'
                  ).replace(/\{\{x\}\}/g, S),
                  'H98'
                ),
              -1 < o.indexOf(S) &&
                !d &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation(
                    '1_3_5_H98.InvalidAutoComplete_Url'
                  ).replace(/\{\{x\}\}/g, S),
                  'H98'
                ),
              -1 < u.indexOf(S) &&
                !g &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation(
                    '1_3_5_H98.InvalidAutoComplete_Telephone'
                  ).replace(/\{\{x\}\}/g, S),
                  'H98'
                ),
              -1 < c.indexOf(S) &&
                !_ &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation(
                    '1_3_5_H98.InvalidAutoComplete_Numeric'
                  ).replace(/\{\{x\}\}/g, S),
                  'H98'
                ),
              -1 < T.indexOf(S) &&
                !M &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation(
                    '1_3_5_H98.InvalidAutoComplete_Month'
                  ).replace(/\{\{x\}\}/g, S),
                  'H98'
                ),
              -1 < C.indexOf(S) &&
                !h &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation(
                    '1_3_5_H98.InvalidAutoComplete_Date'
                  ).replace(/\{\{x\}\}/g, S),
                  'H98'
                )
          }
        },
        process: function (t, a) {
          if (t === a)
            for (let e of HTMLCS.util.getAllElements(t, '*[autocomplete]'))
              this.checkValidAttributes(e), this.checkControlGroups(e)
          else
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              e.HTMLCS.getTranslation('1_3_5_H98.Purpose'),
              'H98'
            ),
              -1 <
                [
                  'hidden',
                  'checkbox',
                  'radio',
                  'file',
                  'submit',
                  'image',
                  'reset',
                  'button',
                ].indexOf(t.getAttribute('type')) ||
                (!1 === t.hasAttribute('autocomplete') &&
                  HTMLCS.addMessage(
                    HTMLCS.NOTICE,
                    t,
                    e.HTMLCS.getTranslation('1_3_5_H98.MissingAutocomplete'),
                    'H98'
                  ))
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_6 = {
        get register() {
          return ['_top']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_3_6_ARIA11.Check'),
            'ARIA11'
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_1 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_4_1_G14,G18'),
            'G14,G182'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_10 = {
        get register() {
          return ['_top', 'pre', 'meta']
        },
        process: (t, a) => {
          if (t === a)
            for (let t of (HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation(
                '1_4_10_C32,C31,C33,C38,SCR34,G206.Check'
              ),
              'C32,C31,C33,C38,SCR34,G206'
            ),
            HTMLCS.util.getAllElements(a, '*')))
              'fixed' ==
                window.getComputedStyle(t, null).getPropertyValue('position') &&
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getTranslation(
                    '1_4_10_C32,C31,C33,C38,SCR34,G206.Fixed'
                  ),
                  'C32,C31,C33,C38,SCR34,G206'
                )
          else
            switch (t.nodeName) {
              case 'PRE':
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  a,
                  e.HTMLCS.getTranslation(
                    '1_4_10_C32,C31,C33,C38,SCR34,G206.Scrolling'
                  ),
                  'C32,C31,C33,C38,SCR34,G206'
                )
                break
              case 'META':
                var i = t.getAttribute('content')
                'viewport' === t.getAttribute('name') &&
                  i &&
                  (-1 < i.indexOf('maximum-scale') ||
                    -1 < i.indexOf('minimum-scale') ||
                    -1 < i.indexOf('user-scalable=no') ||
                    -1 < i.indexOf('user-scalable=0')) &&
                  HTMLCS.addMessage(
                    HTMLCS.WARNING,
                    t,
                    e.HTMLCS.getTranslation(
                      '1_4_10_C32,C31,C33,C38,SCR34,G206.Zoom'
                    ),
                    'C32,C31,C33,C38,SCR34,G206'
                  )
            }
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_11 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_4_11_G195,G207,G18,G145,G174,F78.Check'),
            'G195,G207,G18,G145,G174,F78'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_12 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_4_12_C36,C35.Check'),
            'C36,C35'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_13 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_4_13_F95.Check'),
            'F95'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_2 = {
        get register() {
          return ['object', 'embed', 'applet', 'bgsound', 'audio', 'video']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_4_2_F23'),
            'F23'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3_Contrast = {
        testContrastRatio: function (e, t, a) {
          var i = [],
            n = []
          for (
            e.ownerDocument
              ? n.push(e)
              : (e = e.getElementsByTagName('body')).length && n.push(e[0]);
            0 < n.length;

          ) {
            var s = n.shift()
            if (
              s &&
              1 === s.nodeType &&
              !1 === HTMLCS.util.isVisuallyHidden(s) &&
              !1 === HTMLCS.util.isDisabled(s)
            ) {
              let e = !1,
                _ = null
              for (var r = 0; r < s.childNodes.length; r++)
                1 === s.childNodes[r].nodeType
                  ? n.push(s.childNodes[r])
                  : 3 === s.childNodes[r].nodeType &&
                    s.childNodes[r].nodeValue &&
                    '' !== s.childNodes[r].nodeValue.trim() &&
                    (e = !0)
              if (e) {
                var l = HTMLCS.util.style(s)
                if (l) {
                  _ = l.backgroundColor
                  var o = l.color
                  let e = !1,
                    n = !1,
                    r = !1
                  if (
                    ('none' !== l.backgroundImage && (e = !0),
                    l.background && l.background.includes('gradient('))
                  ) {
                    r = !0
                    break
                  }
                  'absolute' == l.position && (n = !0)
                  let T = s.parentNode,
                    M = 18,
                    C = t
                  for (
                    0.75 * parseFloat(l.fontSize) >=
                      (M =
                        'bold' === l.fontWeight ||
                        600 <= parseInt(l.fontWeight, 10)
                          ? 14
                          : M) && (C = a);
                    ('transparent' === _ || 'rgba(0, 0, 0, 0)' === _) &&
                    T &&
                    T.ownerDocument;

                  ) {
                    var d = HTMLCS.util.style(T)
                    if (
                      ((_ = d.backgroundColor),
                      d.background && d.background.includes('gradient('))
                    ) {
                      r = !0
                      break
                    }
                    'none' !== d.backgroundImage && (e = !0),
                      'absolute' == d.position && (n = !0)
                    var u = HTMLCS.util.style(T, ':before')
                    if (u.background.includes('gradient(')) {
                      r = !0
                      break
                    }
                    if (
                      u &&
                      'fixed' == u.position &&
                      'transform' == u.willChange &&
                      u.width == d.width &&
                      parseInt(u.height, 10) <= parseInt(d.height, 10) &&
                      'none' !== u.backgroundImage
                    ) {
                      e = !0
                      break
                    }
                    T = T.parentNode
                  }
                  var g = HTMLCS.util.colourStrToRGB(_).alpha,
                    c = HTMLCS.util.colourStrToRGB(o).alpha
                  r
                    ? i.push({
                        element: s,
                        colour: o,
                        bgColour: _,
                        value: void 0,
                        required: C,
                        hasAlpha: !1,
                        hasBgGradient: !0,
                      })
                    : _ && g < 1 && 0 < g
                    ? i.push({
                        element: s,
                        colour: o,
                        bgColour: _,
                        value: void 0,
                        required: C,
                        hasAlpha: !0,
                      })
                    : o && c < 1 && 0 < c
                    ? i.push({
                        element: s,
                        colour: o,
                        bgColour: o,
                        value: void 0,
                        required: C,
                        hasAlpha: !0,
                      })
                    : !0 === e
                    ? i.push({
                        element: s,
                        colour: o,
                        bgColour: void 0,
                        value: void 0,
                        required: C,
                        hasBgImage: !0,
                      })
                    : !0 === n
                    ? i.push({
                        element: s,
                        colour: o,
                        bgColour: void 0,
                        value: void 0,
                        required: C,
                        isAbsolute: !0,
                      })
                    : 'transparent' !== _ &&
                      'rgba(0, 0, 0, 0)' !== _ &&
                      (g = HTMLCS.util.contrastRatio(_, o)) < C &&
                      ((c = this.recommendColour(_, o, C)),
                      i.push({
                        element: s,
                        colour: l.color,
                        bgColour: _,
                        value: g,
                        required: C,
                        recommendation: c,
                      }))
                }
              }
            }
          }
          return i
        },
        recommendColour: function (e, t, a) {
          var i = HTMLCS.util.RGBtoColourStr(HTMLCS.util.colourStrToRGB(t)),
            n = HTMLCS.util.RGBtoColourStr(HTMLCS.util.colourStrToRGB(e)),
            t = Math.abs(HTMLCS.util.relativeLum(i) - 0.5),
            e = Math.abs(HTMLCS.util.relativeLum(n) - 0.5)
          let s = null,
            r = null,
            l = '',
            o = 0,
            d = HTMLCS.util.contrastRatio(i, n)
          if (d < a) {
            ;(o = 1.0025),
              t <= e
                ? ((l = 'back'),
                  (r = n),
                  0.5 > HTMLCS.util.relativeLum(n) && (o = 1 / o))
                : ((l = 'fore'),
                  (r = i),
                  0.5 > HTMLCS.util.relativeLum(i) && (o = 1 / o))
            let c = HTMLCS.util.sRGBtoHSV(r),
              _ = i,
              T = n,
              M = !1,
              C = 0
            for (; d < a; ) {
              if ('#fff' === r || '#000' === r) {
                if (!0 === M) {
                  if ('fore' === l) {
                    var u = T
                    let e = 1
                    for (; T === u; )
                      (T = this.multiplyColour(T, Math.pow(1 / o, e))), e++
                  } else {
                    var g = _
                    let e = 1
                    for (; _ === g; )
                      (_ = this.multiplyColour(_, Math.pow(1 / o, e))), e++
                  }
                } else
                  (_ = i),
                    (T = n),
                    (o = 1 / o),
                    (c = 'fore' === l ? ((l = 'back'), n) : ((l = 'fore'), i)),
                    (c = HTMLCS.util.sRGBtoHSV(c)),
                    (M = !0)
              }
              C++,
                (r = HTMLCS.util.HSVtosRGB(c)),
                (r = this.multiplyColour(r, Math.pow(o, C))),
                'fore' === l ? (_ = r) : (T = r),
                (d = HTMLCS.util.contrastRatio(_, T))
            }
            s = {fore: {from: i, to: _}, back: {from: n, to: T}}
          }
          return s
        },
        multiplyColour: function (e, t) {
          var e = HTMLCS.util.sRGBtoHSV(e),
            a = e.saturation * e.value
          return (
            0 === e.value && (e.value = 1 / 255),
            (e.value = e.value * t),
            0 === e.value ? (e.saturation = 0) : (e.saturation = a / e.value),
            (e.value = Math.min(1, e.value)),
            (e.saturation = Math.min(1, e.saturation)),
            HTMLCS.util.RGBtoColourStr(HTMLCS.util.HSVtosRGB(e))
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3_F24 = {
        get register() {
          return ['_top']
        },
        process: function (e, t) {
          var a = {SCRIPT: null, STYLE: null, LINK: null, META: null}
          for (let e of HTMLCS.util.getAllElements(t, '*'))
            e.tagName in a || this.testColourComboFail(e)
        },
        testColourComboFail: (t) => {
          var a, i
          let n =
              t.hasAttribute('color') ||
              t.hasAttribute('link') ||
              t.hasAttribute('vlink') ||
              t.hasAttribute('alink'),
            s = t.hasAttribute('bgcolor')
          ;(s =
            (!!t.style &&
              ((a = t.style.color),
              (i = t.style.background),
              '' === a || 'auto' === a || 'transparent' === a || i || (n = !0),
              '' !== i) &&
              'auto' !== i) ||
            s) !== n &&
            (s
              ? HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getTranslation('1_4_3_F24.BGColour'),
                  'F24.BGColour'
                )
              : HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getTranslation('1_4_3_F24.FGColour'),
                  'F24.FGColour'
                ))
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          if (t === a)
            for (let t of HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3_Contrast.testContrastRatio(
              a,
              4.5,
              3
            )) {
              let a = t.element
              var i = t.required,
                n = t.recommendation,
                s = t.hasBgImage || !1,
                r = t.hasBgGradient || !1,
                l = t.isAbsolute || !1,
                o = t.hasAlpha || !1
              let d = 2,
                u = Math.round(t.value * Math.pow(10, d)) / Math.pow(10, d),
                g = ''
              for (; i === u; )
                d++,
                  (u = Math.round(t.value * Math.pow(10, d)) / Math.pow(10, d))
              4.5 === i ? (g = 'G18') : 3 === i && (g = 'G145')
              let c = []
              n &&
                (n.fore.from !== n.fore.to &&
                  c.push(
                    e.HTMLCS.getTranslation(
                      '1_4_3_G18_or_G145.Fail.Recomendation.Text'
                    ).replace(/\{\{value\}\}/g, n.fore.to + '')
                  ),
                n.back.from !== n.back.to) &&
                c.push(
                  e.HTMLCS.getTranslation(
                    '1_4_3_G18_or_G145.Fail.Recomendation.Background'
                  ).replace(/\{\{value\}\}/g, n.back.to + '')
                ),
                0 < c.length &&
                  (c =
                    ' ' +
                    e.HTMLCS.getTranslation(
                      '1_4_3_G18_or_G145.Fail.Recomendation'
                    ) +
                    ' ' +
                    c.join(', ') +
                    '.'),
                !0 === r
                  ? ((g += '.BgGradient'),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getTranslation(
                        '1_4_3_G18_or_G145.BgGradient'
                      ).replace(/\{\{required\}\}/g, i + ''),
                      g
                    ))
                  : !0 === l
                  ? ((g += '.Abs'),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getTranslation('1_4_3_G18_or_G145.Abs').replace(
                        /\{\{required\}\}/g,
                        i + ''
                      ),
                      g
                    ))
                  : !0 === s
                  ? ((g += '.BgImage'),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getTranslation(
                        '1_4_3_G18_or_G145.BgImage'
                      ).replace(/\{\{required\}\}/g, i + ''),
                      g
                    ))
                  : !0 === o
                  ? ((g += '.Alpha'),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getTranslation(
                        '1_4_3_G18_or_G145.Alpha'
                      ).replace(/\{\{required\}\}/g, i + ''),
                      g
                    ))
                  : ((g += '.Fail'),
                    HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      a,
                      e.HTMLCS.getTranslation('1_4_3_G18_or_G145.Fail')
                        .replace(/\{\{required\}\}/g, i + '')
                        .replace(/\{\{value\}\}/g, u + '') + c,
                      g
                    ))
            }
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_4 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_4_4_G142'),
            'G142'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_5 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          null !== a.querySelector('img') &&
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_4_5_G140,C22,C30.AALevel'),
              'G140,C22,C30.AALevel'
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_6 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          if (t === a)
            for (let t of HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_3_Contrast.testContrastRatio(
              a,
              7,
              4.5
            )) {
              var i = t.required,
                n = t.recommendation,
                s = t.hasBgImage || !1,
                r = t.isAbsolute || !1,
                l = t.hasBgGradient || !1
              let a = t.element,
                o = '',
                d = 2,
                u = Math.round(t.value * Math.pow(10, d)) / Math.pow(10, d)
              for (; i === u; )
                d++,
                  (u = Math.round(t.value * Math.pow(10, d)) / Math.pow(10, d))
              4.5 === i ? (o = 'G18') : 7 === i && (o = 'G17')
              let g = []
              n &&
                (n.fore.from !== n.fore.to &&
                  g.push(
                    e.HTMLCS.getTranslation(
                      '1_4_6_G18_or_G17.Fail.Recomendation.Text'
                    ).replace(/\{\{value\}\}/g, n.fore.to + '')
                  ),
                n.back.from !== n.back.to) &&
                g.push(
                  e.HTMLCS.getTranslation(
                    '1_4_6_G18_or_G17.Fail.Recomendation.Background'
                  ).replace(/\{\{value\}\}/g, n.back.to + '')
                ),
                0 < g.length &&
                  (g =
                    ' ' +
                    e.HTMLCS.getTranslation(
                      '1_4_6_G18_or_G17.Fail.Recomendation'
                    ) +
                    ' ' +
                    g.join(', ') +
                    '.'),
                l
                  ? ((o += '.BgGradient'),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getTranslation(
                        '1_4_6_G18_or_G145.BgGradient'
                      ).replace(/\{\{required\}\}/g, i + ''),
                      o
                    ))
                  : r
                  ? ((o += '.Abs'),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getTranslation('1_4_6_G18_or_G17.Abs').replace(
                        /\{\{required\}\}/g,
                        i + ''
                      ),
                      o
                    ))
                  : s
                  ? ((o += '.BgImage'),
                    HTMLCS.addMessage(
                      HTMLCS.WARNING,
                      a,
                      e.HTMLCS.getTranslation(
                        '1_4_6_G18_or_G17.BgImage'
                      ).replace(/\{\{required\}\}/g, i + ''),
                      o
                    ))
                  : ((o += '.Fail'),
                    HTMLCS.addMessage(
                      HTMLCS.ERROR,
                      a,
                      e.HTMLCS.getTranslation('1_4_6_G18_or_G17.Fail')
                        .replace(/\{\{required\}\}/g, i + '')
                        .replace(/\{\{value\}\}/g, u + '') + g,
                      o
                    ))
            }
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_7 = {
        get register() {
          return ['object', 'embed', 'applet', 'bgsound', 'audio']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('1_4_7_G56'),
            'G56'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_8 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('1_4_8_G148,G156,G175'),
            'G148,G156,G175'
          ),
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_4_8_H87,C20'),
              'H87,C20'
            ),
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_4_8_C19,G172,G169'),
              'C19,G172,G169'
            ),
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_4_8_G188,C21'),
              'G188,C21'
            ),
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_4_8_H87,G146,C26'),
              'H87,G146,C26'
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_4_1_4_9 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          null !== a.querySelector('img') &&
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('1_4_9_G140,C22,C30.NoException'),
              'G140,C22,C30.NoException'
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_1_2_1_1 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          if (t === a) {
            for (let t of HTMLCS.util.getAllElements(
              a,
              '*[onclick], *[onkeyup], *[onkeydown], *[onkeypress], *[onfocus], *[onblur]'
            ))
              HTMLCS.util.isKeyboardNavigable(t) ||
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  t,
                  e.HTMLCS.getTranslation('2_1_1_G90'),
                  'G90'
                )
            for (let t of HTMLCS.util.getAllElements(a, '*[ondblclick]'))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('2_1_1_SCR20.DblClick'),
                'SCR20.DblClick'
              )
            for (let t of HTMLCS.util.getAllElements(a, '*[onmouseover]'))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('2_1_1_SCR20.MouseOver'),
                'SCR20.MouseOver'
              )
            for (let t of HTMLCS.util.getAllElements(a, '*[onmouseout]'))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('2_1_1_SCR20.MouseOut'),
                'SCR20.MouseOut'
              )
            for (let t of HTMLCS.util.getAllElements(a, '*[onmousemove]'))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('2_1_1_SCR20.MouseMove'),
                'SCR20.MouseMove'
              )
            for (let t of HTMLCS.util.getAllElements(a, '*[onmousedown]'))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('2_1_1_SCR20.MouseDown'),
                'SCR20.MouseDown'
              )
            for (let t of HTMLCS.util.getAllElements(a, '*[onmouseup]'))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('2_1_1_SCR20.MouseUp'),
                'SCR20.MouseUp'
              )
          }
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_1_2_1_2 = {
        get register() {
          return ['object', 'applet', 'embed']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.WARNING,
            t,
            e.HTMLCS.getTranslation('2_1_2_F10'),
            'F10'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_1_2_1_4 = {
        get register() {
          return ['_top']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('2_1_4.Check'),
            ''
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_2_2_2_1 = {
        get register() {
          return ['meta']
        },
        process: (t, a) => {
          t.hasAttribute('http-equiv') &&
            'refresh' === t.getAttribute('http-equiv').toLowerCase() &&
            /^[1-9]\d*/.test(t.getAttribute('content')) &&
            (/url=/i.test(t.getAttribute('content'))
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('2_2_1_F40.2'),
                  'F40.2'
                )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('2_2_1_F41.2'),
                  'F41.2'
                ))
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_2_2_2_2 = {
        get register() {
          return ['_top', 'blink']
        },
        process: (t, a) => {
          if (t === a)
            for (let n of (HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              e.HTMLCS.getTranslation('2_2_2_SCR33,SCR22,G187,G152,G186,G191'),
              'SCR33,SCR22,G187,G152,G186,G191'
            ),
            HTMLCS.util.getAllElements(a, '*'))) {
              var i = HTMLCS.util.style(n)
              i &&
                /blink/.test(i['text-decoration']) &&
                HTMLCS.addMessage(
                  HTMLCS.WARNING,
                  n,
                  e.HTMLCS.getTranslation('2_2_2_F4'),
                  'F4'
                )
            }
          else
            'BLINK' === t.nodeName &&
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getTranslation('2_2_2_F47'),
                'F47'
              )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_2_2_2_3 = {
        get register() {
          return ['_top']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('2_2_3_G5'),
            'G5'
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_2_2_2_4 = {
        get register() {
          return ['_top']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('2_2_4_SCR14'),
            'SCR14'
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_2_2_2_5 = {
        get register() {
          return ['_top']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('2_2_5_G105,G181'),
            'G105,G181'
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_2_2_2_6 = {
        get register() {
          return ['_top']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('2_2_6.Check'),
            ''
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_3_2_3_1 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('2_3_1_G19,G176'),
            'G19,G176'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_3_2_3_2 = {
        get register() {
          return ['_top']
        },
        process: (t, a) =>
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('2_3_2_G19'),
            'G19'
          ),
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_3_2_3_3 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('2_3_3.Check'),
            'C39'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_1 = {
        get register() {
          return ['iframe', 'a', 'area', '_top']
        },
        process: function (e, t) {
          if (e === t) this.testGenericBypassMsg(t)
          else
            switch (e.nodeName) {
              case 'IFRAME':
                this.testIframeTitle(e)
                break
              case 'A':
              case 'AREA':
                this.testSameDocFragmentLinks(e, t)
            }
        },
        testIframeTitle: (t) => {
          if ('IFRAME' === t.nodeName) {
            let a = !1
            !1 ===
            (a =
              (!!(!0 === t.hasAttribute('title') && t.getAttribute('title')) &&
                !1 === /^\s+$/.test(t.getAttribute('title'))) ||
              a)
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('2_4_1_H64.1'),
                  'H64.1'
                )
              : HTMLCS.addMessage(
                  HTMLCS.NOTICE,
                  t,
                  e.HTMLCS.getTranslation('2_4_1_H64.2'),
                  'H64.2'
                )
          }
        },
        testGenericBypassMsg: (t) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('2_4_1_G1,G123,G124,H69'),
            'G1,G123,G124,H69'
          )
        },
        testSameDocFragmentLinks: (t, a) => {
          if (t.hasAttribute('href') && HTMLCS.util.isFocusable(t)) {
            var i = t.getAttribute('href').trim()
            if (1 < i.length && '#' === i.charAt(0)) {
              i = i.substring(1)
              try {
                let r = a,
                  l =
                    'function' ==
                    typeof (r = r.ownerDocument ? r.ownerDocument : r)
                      .getElementById
                      ? r.getElementById(i)
                      : null
                if (null === l) {
                  var n = HTMLCS.util.getElementWindow(a).document,
                    s = HTMLCS.util.getDocumentType(n)
                  let e = 'a'
                  s && -1 === s.indexOf('html5') && (e = '*'),
                    (l = r.querySelector(e + '[name="' + i + '"]'))
                }
                ;(null !== l && !1 !== HTMLCS.util.contains(a, l)) ||
                  (!0 === HTMLCS.isFullDoc(a) ||
                  'body' === a.nodeName.toLowerCase()
                    ? HTMLCS.addMessage(
                        HTMLCS.ERROR,
                        t,
                        e.HTMLCS.getTranslation(
                          '2_4_1_G1,G123,G124.NoSuchID'
                        ).replace(/\{\{id\}\}/g, i),
                        'G1,G123,G124.NoSuchID'
                      )
                    : HTMLCS.addMessage(
                        HTMLCS.WARNING,
                        t,
                        e.HTMLCS.getTranslation(
                          '2_4_1_G1,G123,G124.NoSuchIDFragment'
                        ).replace(/\{\{id\}\}/g, i),
                        'G1,G123,G124.NoSuchIDFragment'
                      ))
              } catch (e) {}
            }
          }
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_2 = {
        get register() {
          return ['html']
        },
        process: (t, a) => {
          let i = null
          for (let e of t.childNodes)
            if ('HEAD' === e.nodeName) {
              i = e
              break
            }
          if (null === i)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              e.HTMLCS.getTranslation('2_4_2_H25.1.NoHeadEl'),
              'H25.1.NoHeadEl'
            )
          else {
            let t = null
            for (let e of i.childNodes)
              if ('TITLE' === e.nodeName) {
                t = e
                break
              }
            null === t
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  i,
                  e.HTMLCS.getTranslation('2_4_2_H25.1.NoTitleEl'),
                  'H25.1.NoTitleEl'
                )
              : !0 === /^\s*$/.test(t.innerHTML)
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('2_4_2_H25.1.EmptyTitle'),
                  'H25.1.EmptyTitle'
                )
              : HTMLCS.addMessage(
                  HTMLCS.NOTICE,
                  t,
                  e.HTMLCS.getTranslation('2_4_2_H25.2'),
                  'H25.2'
                )
          }
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_3 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          t === a &&
            a.querySelector('*[tabindex]') &&
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              t,
              e.HTMLCS.getTranslation('2_4_3_H4.2'),
              'H4.2'
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_4 = {
        get register() {
          return ['a']
        },
        process: (t, a) => {
          t.hasAttribute('title')
            ? HTMLCS.addMessage(
                HTMLCS.NOTICE,
                t,
                e.HTMLCS.getTranslation('2_4_4_H77,H78,H79,H80,H81,H33'),
                'H77,H78,H79,H80,H81,H33'
              )
            : HTMLCS.addMessage(
                HTMLCS.NOTICE,
                t,
                e.HTMLCS.getTranslation('2_4_4_H77,H78,H79,H80,H81'),
                'H77,H78,H79,H80,H81'
              )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_5 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('2_4_5_G125,G64,G63,G161,G126,G185'),
            'G125,G64,G63,G161,G126,G185'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_6 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('2_4_6_G130,G131'),
            'G130,G131'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_7 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          null !== a.querySelector('input, textarea, button, select, a') &&
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('2_4_7_G149,G165,G195,C15,SCR31'),
              'G149,G165,G195,C15,SCR31'
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_8 = {
        get register() {
          return ['link']
        },
        process: (t, a) => {
          'HEAD' !== t.parentNode.nodeName &&
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              e.HTMLCS.getTranslation('2_4_8_H59.1'),
              'H59.1'
            ),
            (t.hasAttribute('rel') &&
              t.getAttribute('rel') &&
              !0 !== /^\s*$/.test(t.getAttribute('rel'))) ||
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getTranslation('2_4_8_H59.2a'),
                'H59.2a'
              ),
            (t.hasAttribute('href') &&
              t.getAttribute('href') &&
              !0 !== /^\s*$/.test(t.getAttribute('href'))) ||
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getTranslation('2_4_8_H59.2b'),
                'H59.2b'
              )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_4_2_4_9 = {
        get register() {
          return ['a']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('2_4_9_H30'),
            'H30'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_5_2_5_1 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('2_5_1.Check'),
            ''
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_5_2_5_2 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          if (
            (HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('2_5_2.SinglePointer_Check'),
              ''
            ),
            t == a)
          ) {
            for (let t of HTMLCS.util.getAllElements(a, '*[onmousedown]'))
              HTMLCS.addMessage(
                HTMLCS.NOTICE,
                t,
                e.HTMLCS.getTranslation('2_5_2.Mousedown_Check'),
                ''
              )
            for (let t of HTMLCS.util.getAllElements(a, '*[ontouchstart]'))
              HTMLCS.addMessage(
                HTMLCS.NOTICE,
                t,
                e.HTMLCS.getTranslation('2_5_2.Touchstart_Check'),
                ''
              )
          }
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_5_2_5_3 = {
        get register() {
          return ['_top', 'a', 'button', 'label', 'input']
        },
        process: (t, a) => {
          if (t == a)
            HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('2_5_3_F96.Check'),
              'F96'
            )
          else {
            let r = '',
              l = '',
              o = null
            switch (t.nodeName) {
              case 'A':
              case 'BUTTON':
                ;(r = HTMLCS.util.getTextContent(t)),
                  (l = HTMLCS.util.getAccessibleName(t, a))
                break
              case 'LABEL':
                r = HTMLCS.util.getTextContent(t)
                var i,
                  n,
                  s = t.getAttribute('for')
                s &&
                  (a.ownerDocument
                    ? (o = a.ownerDocument.getElementById(s))
                    : 'function' == typeof a.getElementById &&
                      (o = a.getElementById(s)),
                  o) &&
                  (l = HTMLCS.util.getAccessibleName(o, a))
                break
              case 'INPUT':
                'submit' === t.getAttribute('type') &&
                  (r = t.getAttribute('value')),
                  (l = HTMLCS.util.getAccessibleName(t, a))
            }
            r &&
              l &&
              ((i = r.replace(/[^A-Za-z]/g, '').toLowerCase()),
              (n = l.replace(/[^A-Za-z]/g, '').toLowerCase()),
              i) &&
              n &&
              -1 === n.indexOf(i) &&
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t,
                e.HTMLCS.getTranslation('2_5_3_F96.AccessibleName'),
                'F96'
              )
          }
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_5_2_5_4 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          if (
            (HTMLCS.addMessage(
              HTMLCS.NOTICE,
              a,
              e.HTMLCS.getTranslation('2_5_4.Check'),
              ''
            ),
            t == a)
          )
            for (let a of HTMLCS.util.getAllElements(t, '*[ondevicemotion]'))
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                a,
                e.HTMLCS.getTranslation('2_5_4.Devicemotion'),
                ''
              )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_5_2_5_5 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('2_5_5.Check'),
            ''
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle2_Guideline2_5_2_5_6 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('2_5_6.Check'),
            ''
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_1_3_1_1 = {
        get register() {
          return ['html']
        },
        process: function (t, a) {
          !1 === t.hasAttribute('lang') && !1 === t.hasAttribute('xml:lang')
            ? HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getTranslation('3_1_1_H57.2'),
                'H57.2'
              )
            : (t.hasAttribute('lang') &&
                !this.isValidLanguageTag(t.getAttribute('lang')) &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  a,
                  e.HTMLCS.getTranslation('3_1_1_H57.3.Lang'),
                  'H57.3.Lang'
                ),
              t.hasAttribute('xml:lang') &&
                !this.isValidLanguageTag(t.getAttribute('xml:lang')) &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  a,
                  e.HTMLCS.getTranslation('3_1_1_H57.3.XmlLang'),
                  'H57.3.XmlLang'
                ))
        },
        isValidLanguageTag: function (e) {
          return RegExp(
            '^([ix](-[a-z0-9]{1,8})+)$|^[a-z]{2,8}(-[a-z]{3}){0,3}(-[a-z]{4})?(-[a-z]{2}|-[0-9]{3})?(-[0-9][a-z0-9]{3}|-[a-z0-9]{5,8})*(-[a-wy-z0-9](-[a-z0-9]{2,8})+)*(-x(-[a-z0-9]{1,8})+)?$',
            'i'
          ).test(e)
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_1_3_1_2 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('3_1_2_H58'),
            'H58'
          )
          var i = HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_1_3_1_1,
            n = HTMLCS.util.getAllElements(a, '*[lang]')
          let s = null
          for (let t = 0; t <= n.length; t++)
            (s = t === n.length ? a : n[t]).documentElement ||
              'HTML' === s.nodeName ||
              (!0 === s.hasAttribute('lang') &&
                !1 === i.isValidLanguageTag(s.getAttribute('lang')) &&
                HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  s,
                  e.HTMLCS.getTranslation('3_1_2_H58.1.Lang'),
                  'H58.1.Lang'
                ),
              !s.hasAttribute('xml:lang')) ||
              i.isValidLanguageTag(s.getAttribute('xml:lang')) ||
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                s,
                e.HTMLCS.getTranslation('3_1_2_H58.1.XmlLang'),
                'H58.1.XmlLang'
              )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_1_3_1_3 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('3_1_3_H40,H54,H60,G62,G70'),
            'H40,H54,H60,G62,G70'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_1_3_1_4 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('3_1_4_G102,G55,G62,H28,G97'),
            'G102,G55,G62,H28,G97'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_1_3_1_5 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('3_1_5_G86,G103,G79,G153,G160'),
            'G86,G103,G79,G153,G160'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_1_3_1_6 = {
        get register() {
          return ['ruby']
        },
        process: function (t, a) {
          var i = t.querySelectorAll('rb')
          0 === t.querySelectorAll('rt').length &&
            (0 === i.length
              ? HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('3_1_6_H62.1.HTML5'),
                  'H62.1.HTML5'
                )
              : HTMLCS.addMessage(
                  HTMLCS.ERROR,
                  t,
                  e.HTMLCS.getTranslation('3_1_6_H62.1.XHTML11'),
                  'H62.1.XHTML11'
                )),
            0 === t.querySelectorAll('rp').length &&
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                t,
                e.HTMLCS.getTranslation('3_1_6_H62.2'),
                'H62.2'
              )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_2_3_2_1 = {
        get register() {
          return ['input', 'textarea', 'button', 'select']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('3_2_1_G107'),
            'G107'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_2_3_2_2 = {
        get register() {
          return ['form']
        },
        process: function (e, t) {
          'FORM' === e.nodeName && this.checkFormSubmitButton(e)
        },
        checkFormSubmitButton: (t) => {
          let a = !1
          var i,
            n = t.querySelectorAll('input[type=submit], input[type=image]')
          if (
            !1 ===
              (a =
                0 < n.length ||
                ((n = t.querySelectorAll('button')),
                (i = t.querySelectorAll(
                  'button[type=reset], button[type=button]'
                )),
                n.length > i.length) ||
                a) &&
            t.id
          )
            for (let e of document.querySelectorAll(
              'button[form], input[form][type=submit], input[form][type=image]'
            ))
              e.getAttribute('type'),
                e.attributes.form.value === t.id && (a = !0)
          !1 === a &&
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              t,
              e.HTMLCS.getTranslation('3_2_2_H32.2'),
              'H32.2'
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_2_3_2_3 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('3_2_3_G61'),
            'G61'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_2_3_2_4 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation('3_2_4_G197'),
            'G197'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_2_3_2_5 = {
        get register() {
          return ['a']
        },
        process: function (e, t) {
          'A' === e.nodeName && this.checkNewWindowTarget(e)
        },
        checkNewWindowTarget: (t) => {
          t.hasAttribute('target') &&
            '_blank' === (t.getAttribute('target') || '') &&
            !1 === /new window/i.test(t.innerHTML) &&
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              t,
              e.HTMLCS.getTranslation('3_2_5_H83.3'),
              'H83.3'
            )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_3_3_3_1 = {
        get register() {
          return ['form']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('3_3_1_G83,G84,G85'),
            'G83,G84,G85'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_3_3_3_2 = {
        get register() {
          return ['form']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('3_3_2_G131,G89,G184,H90'),
            'G131,G89,G184,H90'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_3_3_3_3 = {
        get register() {
          return ['form']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('3_3_3_G177'),
            'G177'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_3_3_3_4 = {
        get register() {
          return ['form']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('3_3_4_G98,G99,G155,G164,G168.LegalForms'),
            'G98,G99,G155,G164,G168.LegalForms'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_3_3_3_5 = {
        get register() {
          return ['form']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('3_3_5_G71,G184,G193'),
            'G71,G184,G193'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle3_Guideline3_3_3_3_6 = {
        get register() {
          return ['form']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            t,
            e.HTMLCS.getTranslation('3_3_6_G98,G99,G155,G164,G168.AllForms'),
            'G98,G99,G155,G164,G168.AllForms'
          )
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle4_Guideline4_1_4_1_2 = {
        get register() {
          return ['_top']
        },
        process: function (e, t) {
          if (e === t) {
            for (let a of (e = this.processFormControls(t)).errors)
              HTMLCS.addMessage(
                HTMLCS.ERROR,
                a.element,
                a.msg,
                'H91.' + a.subcode
              )
            for (let t of e.warnings)
              HTMLCS.addMessage(
                HTMLCS.WARNING,
                t.element,
                t.msg,
                'H91.' + t.subcode
              )
            this.addProcessLinksMessages(t)
          }
        },
        addProcessLinksMessages: function (t) {
          for (let a of (t = this.processLinks(t)).empty)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              a,
              e.HTMLCS.getTranslation('4_1_2_H91.A.Empty'),
              'H91.A.Empty'
            )
          for (let a of t.emptyWithName)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              a,
              e.HTMLCS.getTranslation('4_1_2_H91.A.EmptyWithName'),
              'H91.A.EmptyWithName'
            )
          for (let a of t.emptyNoId)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('4_1_2_H91.A.EmptyNoId'),
              'H91.A.EmptyNoId'
            )
          for (let a of t.noHref)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              a,
              e.HTMLCS.getTranslation('4_1_2_H91.A.NoHref'),
              'H91.A.NoHref'
            )
          for (let a of t.placeholder)
            HTMLCS.addMessage(
              HTMLCS.WARNING,
              a,
              e.HTMLCS.getTranslation('4_1_2_H91.A.Placeholder'),
              'H91.A.Placeholder'
            )
          for (let a of t.noContent)
            HTMLCS.addMessage(
              HTMLCS.ERROR,
              a,
              e.HTMLCS.getTranslation('4_1_2_H91.A.NoContent'),
              'H91.A.NoContent'
            )
        },
        processLinks: (e) => {
          var t = {
            empty: [],
            emptyWithName: [],
            emptyNoId: [],
            noHref: [],
            placeholder: [],
            noContent: [],
          }
          for (let i of HTMLCS.util.getAllElements(
            e,
            'a:not([role="button"])'
          )) {
            let e = !1,
              n = !1
            var a = HTMLCS.util.getElementTextContent(i)
            ;((!0 === i.hasAttribute('title') &&
              !1 === /^\s*$/.test(i.getAttribute('title'))) ||
              !1 === /^\s*$/.test(a)) &&
              (e = !0),
              (n =
                (!0 === i.hasAttribute('href') &&
                  !1 === /^\s*$/.test(i.getAttribute('href'))) ||
                n)
                ? e ||
                  i.querySelectorAll('img').length ||
                  HTMLCS.util.hasValidAriaLabel(i) ||
                  t.noContent.push(i)
                : (!0 === /^\s*$/.test(a)
                    ? !0 === i.hasAttribute('id')
                      ? t.empty
                      : !0 === i.hasAttribute('name')
                      ? t.emptyWithName
                      : t.emptyNoId
                    : i.hasAttribute('id') || i.hasAttribute('name')
                    ? t.noHref
                    : t.placeholder
                  ).push(i)
          }
          return t
        },
        processFormControls: function (t) {
          var a = [],
            i = [],
            n = {
              button: ['@title', '_content', '@aria-label', '@aria-labelledby'],
              fieldset: ['legend', '@aria-label', '@aria-labelledby'],
              input_button: ['@value', '@aria-label', '@aria-labelledby'],
              input_text: [
                'label',
                '@title',
                '@aria-label',
                '@aria-labelledby',
              ],
              input_file: [
                'label',
                '@title',
                '@aria-label',
                '@aria-labelledby',
              ],
              input_password: [
                'label',
                '@title',
                '@aria-label',
                '@aria-labelledby',
              ],
              input_checkbox: [
                'label',
                '@title',
                '@aria-label',
                '@aria-labelledby',
              ],
              input_radio: [
                'label',
                '@title',
                '@aria-label',
                '@aria-labelledby',
              ],
              input_image: [
                '@alt',
                '@title',
                '@aria-label',
                '@aria-labelledby',
              ],
              select: ['label', '@title', '@aria-label', '@aria-labelledby'],
              textarea: ['label', '@title', '@aria-label', '@aria-labelledby'],
            }
          for (let e of [
            'email',
            'search',
            'date',
            'datetime-local',
            'month',
            'number',
            'tel',
            'time',
            'url',
            'week',
            'range',
            'color',
          ])
            n['input_' + e] = [
              'label',
              '@title',
              '@aria-label',
              '@aria-labelledby',
            ]
          var s,
            r = {select: 'option_selected'}
          for (let d of HTMLCS.util.getAllElements(
            t,
            'button, fieldset, input, select, textarea, [role="button"]'
          )) {
            let u = d.nodeName.toLowerCase(),
              g =
                d.nodeName.substring(0, 1).toUpperCase() +
                d.nodeName.substring(1).toLowerCase(),
              c =
                ('input' === u &&
                  (d.hasAttribute('type')
                    ? (u += '_' + d.getAttribute('type').toLowerCase())
                    : (u += '_text'),
                  ('input_submit' !== u && 'input_reset' !== u) ||
                    (u = 'input_button'),
                  (g =
                    'Input' +
                    u.substring(6, 7).toUpperCase() +
                    u.substring(7).toLowerCase())),
                n[u]),
              _ = r[u]
            if (
              (c =
                c || 'input_hidden' === u
                  ? c
                  : ['_content', '@aria-label', '@aria-labelledby'])
            ) {
              let i = 0
              for (; i < c.length; i++) {
                let e = c[i]
                if ('_content' === e) {
                  if (!1 === /^\s*$/.test(HTMLCS.util.getElementTextContent(d)))
                    break
                } else if ('label' === e) {
                  if (
                    !1 !==
                    HTMLCS_WCAG2AAA_Sniffs_Principle1_Guideline1_3_1_3_1.testLabelsOnInputs(
                      d,
                      t,
                      !0
                    )
                  )
                    break
                } else if ('@' === e.charAt(0)) {
                  if (
                    (('aria-label' === (e = e.substr(1, e.length)) ||
                      'aria-labelledby' === e) &&
                      HTMLCS.util.hasValidAriaLabel(d)) ||
                    (!0 === d.hasAttribute(e) &&
                      !1 === /^\s*$/.test(d.getAttribute(e)))
                  )
                    break
                } else {
                  var l = d.querySelector(e)
                  if (
                    null !== l &&
                    !1 === /^\s*$/.test(HTMLCS.util.getElementTextContent(l))
                  )
                    break
                }
              }
              if (i === c.length) {
                let t = u + ' ' + e.HTMLCS.getTranslation('4_1_2_element')
                'input_' === u.substring(0, 6) &&
                  (t =
                    u.substring(6) +
                    e.HTMLCS.getTranslation('4_1_2_input_element'))
                var o = c.slice(0, c.length)
                for (let t = 0; t < o.length; t++)
                  '_content' === o[t]
                    ? (o[t] = e.HTMLCS.getTranslation('4_1_2_element_content'))
                    : '@' === o[t].charAt(0)
                    ? (o[t] =
                        o[t].substring(1) +
                        ' ' +
                        e.HTMLCS.getTranslation('4_1_2_attribute'))
                    : (o[t] =
                        o[t] + ' ' + e.HTMLCS.getTranslation('4_1_2_element'))
                let i = e.HTMLCS.getTranslation('4_1_2_msg_pattern')
                  .replace(/\{\{msgNodeType\}\}/g, t)
                  .replace(/\{\{builtAttrs\}\}/g, o.join(', '))
                d.hasAttribute('role') &&
                  'button' === d.getAttribute('role') &&
                  (i = e.HTMLCS.getTranslation(
                    '4_1_2_msg_pattern_role_of_button'
                  ).replace(/\{\{builtAttrs\}\}/g, o.join(', '))),
                  a.push({element: d, msg: i, subcode: g + '.Name'})
              }
            }
            let T = !1
            if (
              (void 0 === _
                ? (T = !0)
                : '_content' === _
                ? ((s = HTMLCS.util.getElementTextContent(d)),
                  !1 === /^\s*$/.test(s) && (T = !0))
                : 'option_selected' === _
                ? (d.hasAttribute('multiple') ||
                    null !== d.querySelector('option[selected]')) &&
                  (T = !0)
                : '@' === _.charAt(0) &&
                  ((_ = _.substr(1, _.length)), !0 === d.hasAttribute(_)) &&
                  (T = !0),
              !1 === (T = !1 === T ? HTMLCS.util.hasValidAriaLabel(d) : T))
            ) {
              let t = u + ' ' + e.HTMLCS.getTranslation('4_1_2_element'),
                n =
                  ('input_' === u.substring(0, 6) &&
                    (t =
                      u.substring(6) +
                      e.HTMLCS.getTranslation('4_1_2_input_element')),
                  e.HTMLCS.getTranslation('4_1_2_msg_pattern2').replace(
                    /\{\{msgNodeType\}\}/g,
                    t
                  )),
                s = '',
                r = !1
              '_content' === _
                ? (s = ' ' + e.HTMLCS.getTranslation('4_1_2_msg_add_one'))
                : 'option_selected' === _
                ? ((r = !0),
                  (n = e.HTMLCS.getTranslation('4_1_2_msg_pattern2').replace(
                    /\{\{msgNodeType\}\}/g,
                    t
                  )))
                : (s =
                    '@' === _.charAt(0)
                      ? ' ' +
                        e.HTMLCS.getTranslation(
                          '4_1_2_value_exposed_using_attribute'
                        ).replace(/\{\{requiredValue\}\}/g, _)
                      : ' ' +
                        e.HTMLCS.getTranslation(
                          '4_1_2_value_exposed_using_element'
                        ).replace(/\{\{requiredValue\}\}/g, _)),
                (n += s),
                (!1 === r ? a : i).push({
                  element: d,
                  msg: n,
                  subcode: g + '.Value',
                })
            }
          }
          return {errors: a, warnings: i}
        },
      }),
      (e.HTMLCS_WCAG2AAA_Sniffs_Principle4_Guideline4_1_4_1_3 = {
        get register() {
          return ['_top']
        },
        process: (t, a) => {
          HTMLCS.addMessage(
            HTMLCS.NOTICE,
            a,
            e.HTMLCS.getTranslation(
              '4_1_3_ARIA22,G199,ARIA19,G83,G84,G85,G139,G177,G194,ARIA23.Check'
            ),
            ''
          )
        },
      }),
      (e.HTMLCS = new (function () {
        let t = new Map(),
          a = new Map(),
          i = new Map(),
          n = ''
        ;(this.ERROR = 'error'),
          (this.WARNING = 'warning'),
          (this.NOTICE = 'notice'),
          (this.PASS = 'pass'),
          (this.lang = 'en'),
          (this.messages = []),
          (this.process = function (n, s, r, l, o) {
            if (!s) return !1
            t.size && t.clear(),
              a.size && a.clear(),
              i.size && i.clear(),
              (this.messages = []),
              void 0 !== e.translation[o] && (this.lang = o),
              t.has(c(n))
                ? HTMLCS.run(r, s)
                : this.loadStandard(
                    n,
                    function () {
                      HTMLCS.run(r, s)
                    },
                    l
                  )
          }),
          (this.getTranslation = (e) => e),
          (this.getAttribute = (e, t, a, i) => {
            if (void 0 === t) return HTMLCS.util.getTextContent(e).trim()
            {
              let n = ''
              return (
                void 0 !== i && (n += i + ',<br>'),
                void 0 === a || !1 === a
                  ? (n += t + '="' + e.getAttribute(t) + '"')
                  : (t.split(',').forEach((t) => {
                      e.hasAttribute(t) &&
                        (n += t + '="' + e.getAttribute(t) + '",<br>')
                    }),
                    (n = n.substring(0, n.length - 5))),
                n
              )
            }
          }),
          (this.loadStandard = (e, t, a) => {
            e &&
              o(
                e,
                function () {
                  ;(n = e), t.call(this)
                },
                a,
                void 0
              )
          }),
          (this.run = function (e, t) {
            var a
            let i = null,
              n = !1
            if ('string' == typeof t) {
              n = !0
              let a = document.createElement('iframe')
              ;(a.style.display = 'none'),
                (a = document.body.insertBefore(a, null)).contentDocument
                  ? (i = a.contentDocument)
                  : i.contentWindow && (i = a.contentWindow.document),
                (a.load = function () {
                  ;(this.onreadystatechange = null),
                    (this.onload = null),
                    HTMLCS.isFullDoc(t) || (i = i.querySelector('body'))
                  var a = HTMLCS.util.getAllElements(i)
                  a.unshift(i), s(a, i, e)
                }),
                (a.onreadystatechange = function () {
                  !0 === /^(complete|loaded)$/.test(this.readyState) &&
                    ((this.onreadystatechange = null), this.load())
                }),
                (a.onload = a.load),
                HTMLCS.isFullDoc(t) || -1 !== t.indexOf('<body')
                  ? i.write(t)
                  : i.write('<div id="__HTMLCS-source-wrap">' + t + '</div>'),
                i.close()
            } else i = t
            if (!i) return e.call(this)
            n ||
              ((a = HTMLCS.util.getAllElements(i)).unshift(i),
              s(a, i, e || function () {}))
          }),
          (this.isFullDoc = (e) => {
            let t = !1
            return (
              'string' == typeof e
                ? (['<html', '<HTML', '<!DOCTYPE html>'].some((t) =>
                    e.startsWith(t)
                  ) ||
                    (-1 !== e.indexOf('<head') && -1 !== e.indexOf('<body'))) &&
                  (t = !0)
                : e && ('HTML' === e.nodeName || e.documentElement) && (t = !0),
              t
            )
          }),
          (this.addMessage = (e, t, a, n, s) => {
            var n = T(n),
              r = n + t.outerHTML,
              l = i.get(r)
            void 0 === l
              ? (i.set(r, this.messages.length),
                this.messages.push({
                  type: e,
                  element: t,
                  message: a,
                  code: n,
                  data: s,
                  recurrence: 0,
                  runner: 'htmlcs',
                }))
              : (this.messages[l].recurrence = this.messages[l].recurrence + 1)
          }),
          (this.getMessages = () => this.messages)
        let s = (e, t, i) => {
            for (; e && 0 < e.length; ) {
              var n = e.shift(),
                s = n === t ? '_top' : n.tagName.toLowerCase(),
                s = a.get(s)
              s && 0 < s.length && r(n, s, t, void 0)
            }
            i instanceof Function == !0 && i.call(this)
          },
          r = (e, t, a, i) => {
            for (; t && 0 < t.length; ) {
              var n = t.shift()
              n.useCallback
                ? n.process(e, a, function () {
                    r(e, t, a, void 0), (t = [])
                  })
                : n.process(e, a)
            }
            i instanceof Function && i.call(this)
          },
          l = (t) =>
            'SECTION508' === t
              ? e.HTMLCS_Section508
              : 'SECTIONBB' === t
              ? e.HTMLCS_SectionBB
              : e['HTMLCS_' + t],
          o = (e, t, a, i) => {
            var s = c(e).split('/')
            let r = s[s.length - 2]
            l(r)
              ? this.registerStandard(e, r, t, a, i)
              : M(
                  n,
                  function () {
                    this.registerStandard(n, r, t, a, i)
                  },
                  a
                )
          },
          d =
            ((this.registerStandard = (e, a, i, n, s) => {
              var r = l(a),
                o = {sniffs: []}
              for (let e in r) void 0 !== r[e] && (o[e] = r[e])
              if ((t.set(e, o), s)) {
                if (s.include && 0 < s.include.length) o.sniffs = s.include
                else if (s.exclude)
                  for (let e of s.exclude) {
                    var u = o.sniffs.find(e)
                    0 <= u && o.sniffs.splice(u, 1)
                  }
              }
              d(e, o.sniffs.slice(0, o.sniffs.length), i, n)
            }),
            (e, t, a, i) => {
              if (!t || 0 === t.length) return a.call(this)
              u(
                e,
                t.shift(),
                function () {
                  d(e, t, a, i)
                },
                i
              )
            }),
          u = (e, t, a, i) => {
            var n
            'string' == typeof t
              ? ((n = () => {
                  this.registerSniff(e, t), a.call(this)
                }),
                _(e, t) ? n() : M(g(e, t), n, i))
              : o(
                  t.standard,
                  function () {
                    a.call(this)
                  },
                  i,
                  {exclude: t.exclude, include: t.include}
                )
          },
          g =
            ((this.registerSniff = (e, t) => {
              var i = _(e, t)
              if (i && 'register' in i)
                for (let e of i.register) {
                  var n = a.get(e)
                  n ? n.push(i) : a.set(e, [i])
                }
            }),
            (e, t) => (
              (e = e.split('/')).pop(),
              e.join('/') + '/Sniffs/' + t.replace(/\./g, '/') + '.js'
            )),
          c = (e) => 'Standards/' + e + '/ruleset.js',
          _ = (t, a) =>
            (t =
              e[(t = `HTMLCS_${t}_Sniffs_` + a.split('.').join('_'))] ||
              window[t])
              ? ((t._name = a), t)
              : null,
          T = (e) => e,
          M = (e, t, a) => {
            let i = document.createElement('script')
            ;(i.onload = function () {
              ;(i.onload = null), (i.onreadystatechange = null), t.call(this)
            }),
              (i.onerror = function () {
                ;(i.onload = null),
                  (i.onreadystatechange = null),
                  a && a.call(this)
              }),
              (i.onreadystatechange = function () {
                !0 === /^(complete|loaded)$/.test(this.readyState) &&
                  ((i.onreadystatechange = null), i.onload())
              }),
              (i.src = e),
              (
                document.head || document.getElementsByTagName('head')[0]
              ).appendChild(i)
          }
      })()),
      (e.HTMLCS.util = {
        isStringEmpty: (e) =>
          'string' != typeof e ||
          ((!e || ' ' === e[0]) &&
            -1 === e.indexOf(String.fromCharCode(160)) &&
            !1 !== /^\s*$/.test(e)),
        getDocumentType: function (e) {
          let t = null
          var a = e.doctype
          if (a) {
            let i = a.name,
              n = a.publicId,
              s = a.systemId
            null === i && (i = ''),
              null === s && (s = ''),
              null === n && (n = ''),
              ('HTML' !== i && 'html' !== i) ||
                ('' === n && '' === s
                  ? (t = 'html5')
                  : -1 !== n.indexOf('//DTD HTML 4.01') ||
                    -1 !== s.indexOf('w3.org/TR/html4/strict.dtd')
                  ? (t = 'html401')
                  : -1 !== n.indexOf('//DTD HTML 4.0') ||
                    -1 !== s.indexOf('w3.org/TR/REC-html40/strict.dtd')
                  ? (t = 'html40')
                  : -1 !== n.indexOf('//DTD XHTML 1.0 Strict') &&
                    -1 !== s.indexOf('w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd')
                  ? (t = 'xhtml10')
                  : -1 !== n.indexOf('//DTD XHTML 1.1') &&
                    -1 !== s.indexOf('w3.org/TR/xhtml11/DTD/xhtml11.dtd') &&
                    (t = 'xhtml11'),
                -1 !== s.indexOf('about:legacy-compat') &&
                  'application/xhtml+xml' === e.contentType &&
                  'http://www.w3.org/1999/xhtml' ===
                    e.querySelector('html').getAttribute('xmlns') &&
                  (t = 'xhtml5'))
          } else
            'application/xhtml+xml' === e.contentType &&
              'http://www.w3.org/1999/xhtml' ===
                e.querySelector('html').getAttribute('xmlns') &&
              (t = 'xhtml5')
          return t
        },
        getElementWindow: (e) =>
          (e = e.ownerDocument || e).defaultView || e.parentWindow,
        hasValidAriaLabel: function (e) {
          let t = !1
          if (e.hasAttribute('aria-labelledby'))
            for (let i of e.getAttribute('aria-labelledby').split(/\s+/)) {
              var a = document.getElementById(i)
              if (a && !/^\s*$/.test(this.getElementTextContent(a))) {
                t = !0
                break
              }
            }
          else
            e.hasAttribute('aria-label') &&
              (t = !/^\s*$/.test(e.getAttribute('aria-label')))
          return t
        },
        hasValidForId: function (e) {
          let t = !1
          var a = e.getAttribute('id')
          if (a)
            for (let e of this.getUniversalElements(document, 'label')) {
              var i = e.getAttribute('for')
              if (i && a === i) {
                t = !0
                break
              }
            }
          return t
        },
        hasValidLabelId: function (e) {
          let t = !1
          if (e.hasAttribute('aria-labelledby'))
            for (let i of e.getAttribute('aria-labelledby').split(/\s+/)) {
              var a = document.getElementById(i)
              if (a && !/^\s*$/.test(this.getElementTextContent(a))) {
                t = !0
                break
              }
            }
          else if (e.hasAttribute('aria-describedby'))
            for (let a of e.getAttribute('aria-describedby').split(/\s+/)) {
              var i = document.getElementById(a)
              if (i && !/^\s*$/.test(this.getElementTextContent(i))) {
                t = !0
                break
              }
            }
          else
            e.hasAttribute('aria-label') &&
              (t = !/^\s*$/.test(e.getAttribute('aria-label')))
          return t
        },
        style: function (e, t) {
          return (
            e.currentStyle ||
            this.getElementWindow(e).getComputedStyle(e, t || null)
          )
        },
        isVisuallyHidden: function (e) {
          return (
            ('title' === e.nodeName &&
              null !== this.findParentNode(e, 'svg')) ||
            !(
              null === (e = this.style(e)) ||
              !(
                'hidden' === e.visibility ||
                'none' === e.display ||
                parseInt(e.left, 10) + parseInt(e.width, 10) < 0 ||
                parseInt(e.top, 10) + parseInt(e.height, 10) < 0
              )
            )
          )
        },
        isAriaHidden: function (e) {
          let t = e.parentElement,
            a = !1
          for (; t; ) {
            if (
              e.hasAttribute('aria-hidden') &&
              'true' === e.getAttribute('aria-hidden')
            ) {
              a = !0
              break
            }
            t = t.parentElement
          }
          return a
        },
        isAccessibilityHidden: function (e) {
          let t = e.parentElement,
            a = !1
          for (; t; ) {
            if (
              (e.hasAttribute('role') && 'none' === e.getAttribute('role')) ||
              'presentation' === e.getAttribute('role') ||
              (e.hasAttribute('aria-hidden') &&
                'true' === e.getAttribute('aria-hidden'))
            ) {
              a = !0
              break
            }
            t = t.parentElement
          }
          return a
        },
        isFocusable: function (e) {
          var t
          return (
            !this.isDisabled(e) &&
            !this.isVisuallyHidden(e) &&
            (('A' === (t = e.nodeName) &&
              e.hasAttribute('href') &&
              !1 === /^\s*$/.test(e.getAttribute('href'))) ||
              'INPUT' === t ||
              'SELECT' === t ||
              'TEXTAREA' === t ||
              'BUTTON' === t ||
              'OBJECT' === t)
          )
        },
        isKeyboardTabbable: function (e) {
          return !0 === e.hasAttribute('tabindex')
            ? '-1' !== e.getAttribute('tabindex')
            : this.isFocusable(e)
        },
        isKeyboardNavigable: function (e) {
          return (
            (e.hasAttribute('accesskey') &&
              !1 === /^\s*$/.test(e.getAttribute('accesskey'))) ||
            this.isKeyboardTabbable(e)
          )
        },
        isDisabled: (e) =>
          e.disabled || 'true' === e.getAttribute('aria-disabled'),
        isInDocument: function (e) {
          let t = e.parentNode
          for (; t && t.ownerDocument; ) t = t.parentNode
          return null !== t
        },
        getAllElements: function (e, t) {
          var e = (e || document).querySelectorAll(t || '*'),
            a = Array(e.length)
          let i = 0
          for (let t of e) this.isAccessibilityHidden(t) || ((a[i] = t), i++)
          return (a.length = i), a
        },
        getUniversalElements: function (e, t) {
          var e = (e || document).querySelectorAll(t || '*'),
            a = Array(e.length)
          let i = 0
          for (let t of e) {
            var n = this.style(t)
            let e = t.parentElement,
              r = !1
            for (; 'HTML' != e?.nodeName && e && e.ownerDocument; ) {
              var s = this.style(e)
              if ('hidden' === s.visibility || 'none' === s.display) {
                r = !0
                break
              }
              e = e.parentElement
            }
            'NOSCRIPT' === t.nodeName ||
              'SCRIPT' === t.nodeName ||
              'hidden' === n.visibility ||
              'none' === n.display ||
              r ||
              ((a[i] = t), i++)
          }
          return (a.length = i), a
        },
        contains: function (e, t) {
          let a = !1
          return (
            e !== t &&
              (e.ownerDocument
                ? ((e.contains && !0 === e.contains(t)) ||
                    (e.compareDocumentPosition &&
                      0 < (16 & e.compareDocumentPosition(t)))) &&
                  (a = !0)
                : t.ownerDocument && t.ownerDocument === e && (a = !0)),
            a
          )
        },
        isLayoutTable: (e) => null === e.querySelector('th'),
        colourStrToRGB: (e) => {
          let t = e.toLowerCase()
          return (
            t.startsWith('rgb')
              ? ((t = {
                  red:
                    (e = /^rgba?\s*\((\d+),\s*(\d+),\s*(\d+)([^)]*)\)$/.exec(
                      t
                    ))[1] / 255,
                  green: e[2] / 255,
                  blue: e[3] / 255,
                  alpha: 1,
                }),
                e[4] && (t.alpha = parseFloat(/^,\s*(.*)$/.exec(e[4])[1])))
              : (4 ===
                  (t =
                    3 === (t = '#' === t.charAt(0) ? t.substring(1) : t).length
                      ? t.replace(/^(.)(.)(.)$/, '$1$1$2$2$3$3')
                      : t).length &&
                  (t = t.replace(/^(.)(.)(.)(.)$/, '$1$1$2$2$3$3$4$4')),
                (t = {
                  red: parseInt(t.substring(0, 2), 16) / 255,
                  green: parseInt(t.substring(2, 4), 16) / 255,
                  blue: parseInt(t.substring(4, 6), 16) / 255,
                  alpha:
                    8 === t.length ? parseInt(t.substring(6, 8), 16) / 255 : 1,
                })),
            t
          )
        },
        relativeLum: function (e) {
          let t = e
          var a = {red: 0, green: 0, blue: 0}
          for (let e in (t = t.charAt ? this.colourStrToRGB(t) : t))
            t[e] <= 0.03928
              ? (a[e] = t[e] / 12.92)
              : (a[e] = Math.pow((t[e] + 0.055) / 1.055, 2.4))
          return 0.2126 * a.red + 0.7152 * a.green + 0.0722 * a.blue
        },
        contrastRatio: function (e, t) {
          return (e =
            (0.05 + this.relativeLum(e)) / (0.05 + this.relativeLum(t))) < 1
            ? 1 / e
            : e
        },
        RGBtoColourStr: (e) => {
          let t = '#'
          return (
            (e.red = Math.round(255 * e.red)),
            (e.green = Math.round(255 * e.green)),
            (e.blue = Math.round(255 * e.blue)),
            e.red % 17 == 0 && e.green % 17 == 0 && e.blue % 17 == 0
              ? (t =
                  (t =
                    (t += (e.red / 17).toString(16)) +
                    (e.green / 17).toString(16)) + (e.blue / 17).toString(16))
              : (e.red < 16 && (t += '0'),
                (t += e.red.toString(16)),
                e.green < 16 && (t += '0'),
                (t += e.green.toString(16)),
                e.blue < 16 && (t += '0'),
                (t += e.blue.toString(16))),
            t
          )
        },
        sRGBtoHSV: function (e) {
          var e = 'string' == typeof e && e.charAt ? this.colourStrToRGB(e) : e,
            t = {hue: 0, saturation: 0, value: 0},
            a = Math.max(e.red, e.green, e.blue),
            i = a - Math.min(e.red, e.green, e.blue)
          return (
            0 == i
              ? (t.value = e.red)
              : ((t.value = a) === e.red
                  ? (t.hue = (e.green - e.blue) / i)
                  : a === e.green
                  ? (t.hue = 2 + (e.blue - e.red) / i)
                  : (t.hue = 4 + (e.red - e.green) / i),
                (t.hue = 60 * t.hue),
                360 <= t.hue && (t.hue -= 360),
                (t.saturation = i / t.value)),
            t
          )
        },
        HSVtosRGB: function (e) {
          var t = {red: 0, green: 0, blue: 0}
          if (0 === e.saturation)
            (t.red = e.value), (t.green = e.value), (t.blue = e.value)
          else {
            var a = e.value * e.saturation,
              i = e.value - a,
              e = e.hue / 60,
              n = a * (1 - Math.abs(e - 2 * Math.floor(e / 2) - 1))
            switch (Math.floor(e)) {
              case 0:
                ;(t.red = a), (t.green = n)
                break
              case 1:
                ;(t.green = a), (t.red = n)
                break
              case 2:
                ;(t.green = a), (t.blue = n)
                break
              case 3:
                ;(t.blue = a), (t.green = n)
                break
              case 4:
                ;(t.blue = a), (t.red = n)
                break
              case 5:
                ;(t.red = a), (t.blue = n)
            }
            ;(t.red = t.red + i), (t.green = t.green + i), (t.blue = t.blue + i)
          }
          return t
        },
        getElementTextContent: function (e, t) {
          var a = void 0 === t || t,
            i = e ? e.childNodes.length : 0,
            n = Array(i)
          for (let t = 0; t < i; t++) n[t] = e.childNodes[t]
          n.length = i
          var s = Array(i)
          s[0] = e.textContent
          let r = 1
          for (; 0 < n.length; ) {
            var l = n.shift()
            if (1 === l.nodeType) {
              if ('IMG' === l.nodeName)
                !0 === a &&
                  !0 === l.hasAttribute('alt') &&
                  ((s[r] = l.getAttribute('alt')), r++)
              else {
                for (let e = 0; e < l.childNodes.length; e++)
                  n[e] = l.childNodes[e]
                n.length = l.childNodes.length
              }
            } else 3 === l.nodeType && ((s[r] = l.nodeValue), r++)
          }
          return (s.length = r), s.join('').replace(/^\s+|\s+$/g, '')
        },
        getCustomElementTextContent: function (e, t) {
          var a = void 0 === t || t,
            i = e ? e.childNodes.length : 0,
            n = Array(i)
          for (let t = 0; t < i; t++) n[t] = e.childNodes[t]
          n.length = i
          var s = Array(i)
          s[0] = e.textContent
          let r = 1
          for (; 0 < n.length; ) {
            var l = n.shift()
            if (1 === l.nodeType) {
              if ('IMG' === l.nodeName)
                !0 === a &&
                  !0 === l.hasAttribute('alt') &&
                  ((s[r] = l.getAttribute('alt')), r++)
              else {
                for (let e = 0; e < l.childNodes.length; e++)
                  n[e] = l.childNodes[e]
                n.length = l.childNodes.length
              }
            } else 3 === l.nodeType && ((s[r] = l.nodeValue), r++)
          }
          return (s.length = r), s.join('').replace(/^\s+|\s+$/g, '')
        },
        findParentNode: function (e, t) {
          if (e && e.matches(t)) return e
          for (; e && e.parentNode; )
            if ((e = e.parentNode) && e.matches(t)) return e
          return null
        },
        eachParentNode: function (e, t) {
          for (; e && e.parentNode; ) {
            var a = t(e)
            if (((e = e.parentNode), a)) break
          }
        },
        getChildrenForTable: function (e, t) {
          if ('TABLE' !== e.nodeName) return null
          var t = e.getElementsByTagName(t),
            a = Array(t.length)
          let i = 0
          for (let n of t)
            this.findParentNode(n, 'table') === e && ((a[i] = n), i++)
          return (a.length = i), a
        },
        testTableHeaders: function (e) {
          var t = {
              required: !0,
              used: !1,
              correct: !0,
              allowScope: !0,
              missingThId: [],
              missingTd: [],
              wrongHeaders: [],
              isMultiLevelHeadersTable: !1,
              simpleTable: !1,
            },
            a = [],
            i = {rows: [], cols: []},
            n = {rows: 0, cols: 0},
            s = this.getChildrenForTable(e, 'tr')
          for (let e = 0; e < s.length; e++) {
            let n = 0
            for (let d of s[e].childNodes)
              if (1 === d.nodeType) {
                if (a[e]) for (; a[e][0] === n; ) a[e].shift(), n++
                var r = d.nodeName,
                  l = Number(d.getAttribute('rowspan')) || 1,
                  o = Number(d.getAttribute('colspan')) || 1
                if (l)
                  for (let t = e + 1; t < e + l; t++) {
                    a[t] || (a[t] = [])
                    for (let e = n; e < n + o; e++) a[t].push(e)
                  }
                'TH' === r
                  ? (e || t.simpleTable || (t.simpleTable = !0),
                    e && t.simpleTable && (t.simpleTable = !1),
                    '' === (d.getAttribute('id') || '') &&
                      ((t.correct = !1), t.missingThId.push(d)),
                    l && o
                      ? (t.allowScope = !1)
                      : t.allowScope &&
                        (void 0 === i.cols[n] && (i.cols[n] = 0),
                        void 0 === i.rows[e] && (i.rows[e] = 0),
                        (i.rows[e] += o),
                        (i.cols[n] += l)))
                  : 'TD' === r &&
                    d.hasAttribute('headers') &&
                    !1 === /^\s*$/.test(d.getAttribute('headers')) &&
                    (t.used = !0),
                  (n += o)
              }
          }
          for (let e of (t.simpleTable && (t.required = !1), i.rows))
            e && n.rows++
          for (let e of i.cols) e && n.cols++
          for (let a of (n.rows || n.cols
            ? ((t.allowScope = !1), (t.isMultiLevelHeadersTable = !0))
            : t.allowScope &&
              (0 === n.rows || 0 === n.cols) &&
              (t.required = !1),
          this.getCellHeaders(e))) {
            var d = a.headers,
              u = a.cell
            if (u.hasAttribute('headers')) {
              let e = (u.getAttribute('headers') || '').split(/\s+/)
              0 === e.length
                ? ((t.correct = !1), t.missingTd.push(u))
                : d !==
                    (e = (e = ' ' + e.sort().join(' ') + ' ')
                      .replace(/\s+/g, ' ')
                      .replace(/(\w+\s)\1+/g, '$1')
                      .replace(/^\s*(.*?)\s*$/g, '$1')) &&
                  ((t.correct = !1),
                  t.wrongHeaders.push({
                    element: u,
                    expected: d,
                    actual: u.getAttribute('headers') || '',
                  }))
            } else (t.correct = !1), t.missingTd.push(u)
          }
          return t
        },
        getCellHeaders: function (e) {
          if ('object' != typeof e || 'TABLE' !== e.nodeName) return null
          var t = [],
            a = {rows: {}, cols: {}},
            i = [],
            n = this.getChildrenForTable(e, 'tr')
          for (let e of ['TH', 'TD'])
            for (let _ = 0; _ < n.length; _++) {
              var s = n[_]
              let T = 0
              for (let n = 0; n < s.childNodes.length; n++) {
                var r = s.childNodes[n]
                if (1 === r.nodeType) {
                  if (t[_]) for (; t[_][T]; ) T++
                  var l = r.nodeName,
                    o = Number(r.getAttribute('rowspan')) || 1,
                    d = Number(r.getAttribute('colspan')) || 1
                  if (o)
                    for (var u = _ + 1; u < _ + o; u++) {
                      t[u] || (t[u] = [])
                      for (var g = T; g < T + d; g++) t[u][g] = !0
                    }
                  if (l === e) {
                    if ('TH' === l) {
                      for (
                        var c = r.getAttribute('id') || '', u = _;
                        u < _ + o;
                        u++
                      )
                        (a.rows[u] = a.rows[u] || {first: T, ids: []}),
                          a.rows[u].ids.push(c)
                      for (u = T; u < T + d; u++)
                        (a.cols[u] = a.cols[u] || {first: _, ids: []}),
                          a.cols[u].ids.push(c)
                    } else if ('TD' === l) {
                      let e = []
                      for (u = _; u < _ + o; u++)
                        for (g = T; g < T + d; g++)
                          a.rows[u] &&
                            g >= a.rows[u].first &&
                            (e = e.concat(a.rows[u].ids)),
                            a.cols[g] &&
                              u >= a.cols[g].first &&
                              (e = e.concat(a.cols[g].ids))
                      0 < e.length &&
                        ((l = e.sort().filter(function (e, t) {
                          return e.indexOf(t)
                        })),
                        i.push({
                          cell: r,
                          headers: ` ${l.join(' ')} `
                            .replace(/\s+/g, ' ')
                            .replace(/(\w+\s)\1+/g, '$1')
                            .replace(/^\s*(.*?)\s*$/g, '$1'),
                        }))
                    }
                  }
                  T += d
                }
              }
            }
          return i
        },
        getPreviousSiblingElement: function (e, t, a) {
          void 0 === t && (t = null), void 0 === a && (a = !1)
          let i = e.previousSibling
          for (; null !== i; ) {
            if (3 === i.nodeType) {
              if (!1 === this.isStringEmpty(i.nodeValue) && !0 === a) {
                i = null
                break
              }
            } else if (1 === i.nodeType) {
              if (null === t || i.nodeName === t) break
              if (!0 === a) {
                i = null
                break
              }
            }
            i = i.previousSibling
          }
          return i
        },
        getNextSiblingElement: function (e, t, a) {
          void 0 === t && (t = null), void 0 === a && (a = !1)
          let i = e.nextSibling
          for (; null !== i; ) {
            if (3 === i.nodeType) {
              if (!1 === this.isStringEmpty(i.nodeValue) && !0 === a) {
                i = null
                break
              }
            } else if (1 === i.nodeType) {
              if (null === t || i.nodeName === t) break
              if (!0 === a) {
                i = null
                break
              }
            }
            i = i.nextSibling
          }
          return i
        },
        getTextContent: (e) => e.textContent || e.innerText,
        getAccessibleName: function (e, t) {
          if (this.isVisuallyHidden(e)) return ''
          if (e.getAttribute('aria-labelledby')) {
            var a = e.getAttribute('aria-labelledby').split(' '),
              i = Array(a.length)
            let s = 0
            if (t && 'function' == typeof t.getElementById)
              for (let e of a) {
                var n = t.getElementById(e)
                n && ((i[s] = n.textContent), s++)
              }
            return (i.length = s), i.join(' ')
          }
          return e.getAttribute('aria-label') ||
            (e.getAttribute('title') &&
              'presentation' !== e.getAttribute('role') &&
              'none' !== e.getAttribute('role'))
            ? e.getAttribute('aria-label')
            : ''
        },
        logger(e) {
          console.log(e)
        },
      }),
      e
    )
  })
  window.__a11y.runners['htmlcs'] = async (e) =>
    new Promise((n, o) => {
      if (
        ('function' == typeof window.define &&
          window.define.amd &&
          'function' == typeof window.require &&
          window.require(['htmlcs'], (e) => {
            Object.keys(e).forEach((n) => {
              window[n] = e[n]
            }),
              (window.HTMLCS = e.HTMLCS)
          }),
        !(
          !e.rules ||
          (e.rules && !e.rules.length) ||
          'Section508' === e.standard ||
          'SectionBB' === e.standard
        ))
      )
        for (let n of e.rules)
          window.HTMLCS_WCAG2AAA.sniffs.includes(n)
            ? window[`HTMLCS_${e.standard}`].sniffs[0].include.push(n)
            : console.error(`${n} is not a valid WCAG 2.1 rule`)
      window.HTMLCS.process(
        e.standard || 'WCAG2AA',
        (e.rootElement && window.document.querySelector(e.rootElement)) ||
          window.document,
        (e) => {
          if (e) return o(e)
          n(window.HTMLCS.getMessages())
        },
        (e) => o(e),
        e.language
      )
    })
}

let htmlcsLoaded = false

window.addEventListener('scally_send', async (event) => {
  console.log('scally_send event received:', event)

  for (const option of event.detail.options.runners) {
    if (option === 'htmlcs' && !htmlcsLoaded) {
      hr()
      htmlcsLoaded = true
    }
  }

  const auditResult = await window.__a11y.run(event.detail.options)

  console.log('Audit result:', auditResult)

  window.dispatchEvent(
    new CustomEvent('scally_receive', {
      detail: {
        name: 'scally',
        data: auditResult,
      },
    })
  )

  chrome.runtime.sendMessage(
    {
      action: 'sendAuditResult',
      result: auditResult,
    },
    (response) => {
      console.log('Response from background script:', response)
    }
  )
})


// To add ::before of Trail btn to increasee hover area
const before = document.createElement('style')
before.innerHTML = `#trail-btn::before { content: ""; display: block; width: 121px; height: 40px; background: transparent; position: absolute; top: -32px; }`
document.head.appendChild(before)

// To inject Trail extension button on load
const extensionBtn = new DOMParser().parseFromString(
  "<button id='trail-btn' style='display: flex; align-items: center; justify-content: center; position: fixed; width: 121px; height: 40px; font-size: 16px; color: #FEFEFE; padding: 8px !important; background: #5928ED; border: 1px solid #FEFEFE !important; border-bottom: 0 !important; top: 244px; right: -72px; border-radius: 4px 4px 0px 0px !important; cursor: pointer; transform: rotate(-90deg); z-index: 9999999'><svg xmlns='http://www.w3.org/2000/svg' aria-label='Trail AMS' width='64' height='12' viewBox='0 0 64 12' fill='#FEFEFE'><path d='M0 0.806585H8.09435V2.55144H4.97867V11.7531H3.03538V2.55144H0V0.806585Z'/><path d='M9.72409 6.55144V11.7531H7.81292V4.80658L7.66838 3.47325H9.24228L9.43501 4.6749C9.78833 3.73663 10.5753 3.22634 11.3783 3.22634C11.8601 3.22634 12.3098 3.34156 12.6631 3.55556L12.3258 5.21811C11.9725 5.02058 11.6031 4.88889 11.1856 4.88889C10.3183 4.88889 9.75621 5.59671 9.72409 6.55144Z'/><path d='M19.8556 3.80247V10.1728L20.0001 11.7531H18.3459L18.2335 10.8807L18.1693 10.8642C17.6714 11.6049 16.8523 11.9671 15.969 11.9671C13.7045 11.9671 12.8212 10.321 12.8212 7.96708C12.8212 5.06996 14.2345 3.22634 16.9969 3.22634C17.5268 3.22634 18.6992 3.35802 19.8556 3.80247ZM17.9605 9.1358V4.87243C17.7196 4.7572 17.2538 4.65844 16.756 4.65844C15.2302 4.65844 14.7163 6.12346 14.7163 7.90123C14.7163 9.26749 15.0375 10.5679 16.3866 10.5679C17.3823 10.5679 17.9605 9.84362 17.9605 9.1358Z'/><path d='M23.8082 11.7531H21.897V3.47325H23.8082V11.7531ZM21.7364 1.10288C21.7364 0.493828 22.1861 0 22.8445 0C23.503 0 23.9527 0.493828 23.9527 1.10288C23.9527 1.7284 23.4869 2.1893 22.8445 2.1893C22.17 2.1893 21.7364 1.7284 21.7364 1.10288Z'/><path d='M25.7858 0.329219H27.697V9.0535C27.697 10.0741 27.9058 10.4527 28.5642 10.4527C28.8854 10.4527 29.2388 10.3374 29.576 10.1893L29.9936 11.5062C29.56 11.786 28.773 12 28.0824 12C25.9143 12 25.7858 10.6996 25.7858 9.46502V0.329219Z'/><path d='M35.4252 11.7531H33.5301L37.224 0.806585H39.4082L43.1823 11.7531H41.0945L40.1309 8.85597H36.3728L35.4252 11.7531ZM38.2518 2.65021L36.7582 7.34156H39.7454L38.3 2.65021C38.2839 2.65021 38.2518 2.65021 38.2518 2.65021Z'/><path d='M49.8312 7.96708L52.5775 0.806585H54.7135L55.2917 11.7531H53.4287L53.0272 4.21399C53.0112 4.21399 52.9951 4.21399 52.9951 4.21399L50.5218 10.535H49.0443L46.6353 4.27984C46.6353 4.27984 46.6192 4.27984 46.6031 4.27984L46.2016 11.7531H44.3386L44.9489 0.806585H47.1331L49.7991 7.96708C49.7991 7.96708 49.8152 7.96708 49.8312 7.96708Z'/><path d='M56.4035 10.8971L57.1262 9.25103C57.7365 9.64609 58.9892 10.2058 60.0974 10.2058C60.9486 10.2058 61.8158 9.92593 61.8158 8.69136C61.8158 7.65432 60.9004 7.34156 59.7762 7.02881C58.1862 6.58436 56.7087 5.94239 56.7087 3.83539C56.7087 1.82716 58.2183 0.609053 60.3222 0.609053C61.8158 0.609053 63.1649 1.28395 64 2.15638L62.9561 3.48971C62.1209 2.78189 61.2055 2.32099 60.3222 2.32099C59.5995 2.32099 58.7483 2.63375 58.7483 3.65432C58.7483 4.6749 59.6798 4.98765 60.8843 5.36626C62.3458 5.84362 63.8876 6.4856 63.8876 8.60905C63.8876 10.7819 62.3779 11.9506 60.0652 11.9506C58.4913 11.9506 56.9496 11.3086 56.4035 10.8971Z'/></svg><svg width='24' height='1' viewBox='0 0 24 1' style = 'transform: rotate(90deg);' xmlns='http://www.w3.org/2000/svg'><rect width='24' height='1' fill='#FEFEFE'/></svg><svg style = 'transform: rotate(90deg);' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path d='M11.1499 18.415V20.2856H12.8202V18.415C12.8202 16.1428 13.5252 15.0743 19.9575 15.0743H23.6026C22.244 20.2113 17.5657 24 12.0005 24C6.43537 24 1.71775 20.1793 0.380914 15.0114H10.8443V13.341H0.0753561C0.0247732 12.9002 0 12.4522 0 12C0 11.5478 0.0247732 11.0998 0.0753561 10.659H3.99397C7.37992 10.659 9.29589 10.3864 10.609 9.72058C12.1037 8.96181 12.8006 7.66724 12.8006 5.64797V3.77529H11.1303V5.64797C11.1303 7.9181 10.4252 8.98864 3.99397 8.98864H0.380914C1.71671 3.81865 6.41266 0 12.0005 0C17.5884 0 22.3215 3.84859 23.6346 9.05059H13.1061V10.7209H23.9319C23.9773 11.1421 24 11.5675 24 12C24 12.4759 23.9711 12.9436 23.9184 13.405H19.9575C14.1157 13.405 11.1499 14.1803 11.1499 18.416V18.415Z' fill='#FEFEFE'/></svg></button>",
  'text/html'
).body.firstElementChild
document.body.insertBefore(extensionBtn, document.body.firstChild)

// To inject Trail extension iframe on load
const iframe = new DOMParser().parseFromString(
  "<iframe id='trail-iframe' title='trail-extension' allow='clipboard-write' style = 'width: 0px !important; height: 100vh; position: fixed; top: 0; right: 0; border: none; border-radius: 5px; z-index: 999999; box-shadow: -8px 0px 24px 0px rgba(0, 0, 0, 0.12);'></iframe>",
  'text/html'
).body.firstElementChild
iframe.src = chrome.runtime.getURL('index.html')
document.body.insertBefore(iframe, document.body.firstChild.nextSibling)

const labelColors = {
  RED_700: '#D20000',
  BLUE_700: '#294CB5',
  GREEN_800: '#458A46',
  PURPLE_700: '#5827DA',
  YELLOW_700: '#F5BD00',
  NEUTRAL_50: '#FEFEFE',
  NEUTRAL_700: '#484453',
  NEUTRAL_900: '#19171D',
}

// To display iframe
extensionBtn.addEventListener('click', () => {
  showIframe()
})

// To handle animation of trail button on focus
extensionBtn.addEventListener('focusin', () => {
  extensionBtn.style.right = '-41px'
  extensionBtn.style.transition = 'all 0.5s ease'
})

// To handle animation of trail button going out of focus
extensionBtn.addEventListener('focusout', () => {
  extensionBtn.style.right = '-72px'
  extensionBtn.style.transition = 'all 0.5s ease'
})

// To handle keyboard shortcut to display / hide iframe
let keys = {}
window.addEventListener('keydown', (ev) => {
  keys[ev.key] = true
})

window.addEventListener('keyup', () => {
  if (keys['Control'] && keys['b']) {
    showIframe()
  }
  if (keys['Escape']) {
    hideIframe()
    console.log('Escape key pressed from browser')
  }
  keys = {}
})

// iframe.contentWindow.document.addEventListener("keydown", (event) => {
//   if (event.key === "Escape") {
//     console.log("Escape key pressed from iframe");
//   }
// });

window.addEventListener('message', (event) => {
  // To minimize iframe
  if (event.data === 'minimise-button-clicked') {
    hideIframe()
    extensionBtn.focus()
  }

  // To inject tab order labels
  if (event.data === 'show-tab-order') {
    injectTabOrderLabels()
  }

  if (event.data === 'hide-tab-order') {
    const tabOrderLabels = document.querySelectorAll('.tab-order-label')
    tabOrderLabels.forEach((label) => label.remove())

    const svgContainer = document.querySelector('#svg-container')
    if (svgContainer) {
      svgContainer.remove()
    }
  }
})

// Function to get all focusable elements
function getFocusableElements() {
  const focusableSelectors = `a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], details, summary, map`

  const focusableElements = document.querySelectorAll(focusableSelectors)
  function isVisible(element) {
    return (
      !!(
        element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
      ) &&
      window.getComputedStyle(element).visibility !== 'hidden' &&
      element.id !== 'trail-btn' &&
      element.id !== 'trail-iframe'
    )
  }

  // Convert NodeList to Array and filter out non-visible elements
  const visibleFocusableElements =
    Array.from(focusableElements).filter(isVisible)
  return Array.from(visibleFocusableElements)
}

// Function to inject labels indicating tab order
const labelPositions = []
function injectTabOrderLabels() {
  const focusableElements = getFocusableElements()

  if (document.querySelectorAll('.tab-order-label').length <= 0) {
    Array.from(focusableElements).forEach((element, index) => {
      const label = document.createElement('span')
      label.className = 'tab-order-label'
      label.textContent = index + 1
      label.style.position = 'absolute'
      label.style.display = 'flex'
      label.style.justifyContent = 'center'
      label.style.alignItems = 'center'
      label.style.backgroundColor = '#5928ed'
      label.style.color = 'white'
      label.style.border = '2px solid white'
      label.style.fontSize = '12px'
      label.style.fontWeight = 'bold'
      label.style.width = '32px'
      label.style.height = '32px'
      label.style.borderRadius = '50%'
      label.style.zIndex = '100000'

      if (element.nextSibling) {
        element.parentNode.insertBefore(label, element.nextSibling)
      } else {
        element.parentNode.appendChild(label)
      }

      const elementRect = element.getBoundingClientRect()
      const labelRect = label.getBoundingClientRect()

      if (elementRect.x + elementRect.width < 32 || labelRect.x < 32) {
        label.style.transform = 'translateX(0%)'
      } else {
        label.style.transform = 'translate(-50%, -50%)'
      }

      if (elementRect.y + elementRect.height < 32 || labelRect.y < 32) {
        label.style.transform = 'translateY(0%)'
      } else {
        label.style.transform = 'translate(-50%, -50%)'
      }

      labelPositions.push({
        element: label,
        x: labelRect.left,
        y: labelRect.top,
      })
    })
    drawLines(labelPositions)
  }
}

function drawLines(positions) {
  const svgContainer = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'svg'
  )
  svgContainer.setAttribute('id', 'svg-container')
  svgContainer.style.width = '100%'
  svgContainer.style.height = `${document.documentElement.scrollHeight}px`
  svgContainer.style.position = 'absolute'
  svgContainer.style.top = '0'
  svgContainer.style.left = '0'
  svgContainer.style.pointerEvents = 'none'
  svgContainer.style.zIndex = '999'
  document.body.appendChild(svgContainer)

  positions.forEach((pos, index) => {
    if (index < positions.length - 1) {
      const line = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'line'
      )
      line.setAttribute('x1', pos.x)
      line.setAttribute('y1', pos.y)
      line.setAttribute('x2', positions[index + 1].x)
      line.setAttribute('y2', positions[index + 1].y)
      line.setAttribute('stroke', '#5928ed')
      line.setAttribute('stroke-width', '2')
      svgContainer.appendChild(line)
    }
  })
}

// function updateLines() {
//   const svgLines = document.querySelectorAll("#svg-container line");
//   svgLines.forEach(line => {
//     line.remove();
//   })
//   labelPositions.forEach(pos => {
//     const rect = pos.element.getBoundingClientRect();
//     pos.x = rect.left + (rect.width / 2);
//     pos.y = rect.top + (rect.height / 2);
//   });
//   drawLines(labelPositions);
// }

// window.addEventListener('resize', () => {
//   updateLines();
// });

// To show button on mouse hover
extensionBtn.addEventListener('mouseover', () => {
  extensionBtn.style.right = '-41px'
  extensionBtn.style.transition = 'all 0.5s ease'
})

// To hide button on mouse leave
extensionBtn.addEventListener('mouseout', () => {
  extensionBtn.style.right = '-72px'
  extensionBtn.style.transition = 'all 0.5s ease'
})

// Function to show extension iframe
function showIframe() {
  extensionBtn.style.top = '1000px'
  extensionBtn.style.transition = 'top 1s ease'
  iframe.style.transition = 'width 0.5s ease'
  iframe.style.width = '612px'
  iframe.focus()
}

// Function to hide extension iframe
function hideIframe() {
  extensionBtn.style.display = 'flex'
  extensionBtn.style.top = '244px'
  extensionBtn.style.transition = 'top 1s ease'
  iframe.style.transition = 'width 0.5s ease'
  iframe.style.width = '0px'
  // extensionBtn.focus()
}

function showHeadings() {
  const headings = document.querySelectorAll(
    'h1, h2, h3, h4, h5, h6',
    '[role=heading][aria-level=1]',
    '[role=heading][aria-level=2]',
    '[role=heading][aria-level=3]',
    '[role=heading][aria-level=4]',
    '[role=heading][aria-level=5]',
    '[role=heading][aria-level=6]'
  )

  if (document.querySelectorAll('.heading-label').length <= 0) {
    headings.forEach((heading) => {
      const headingLabel = document.createElement('strong')
      headingLabel.className = 'heading-label'
      headingLabel.style.color = labelColors.NEUTRAL_50
      headingLabel.style.padding = '2px 4px'
      headingLabel.style.margin = '4px'
      headingLabel.style.fontSize = '12px'
      headingLabel.style.fontWeight = 'bold'
      headingLabel.style.borderRadius = '4px'
      headingLabel.style.border = `1px solid ${labelColors.NEUTRAL_50}`
      headingLabel.style.verticalAlign = 'middle'
      headingLabel.style.zIndex = '100000'
      headingLabel.style.speak = 'literal-punctuation' //not supported by some browsers
      headingLabel.textContent = `<${heading.tagName}>`
      headingLabel.style.textTransform = 'lowercase'
      heading.prepend(headingLabel)

      switch (headingLabel.textContent) {
        case '<H1>':
          headingLabel.style.backgroundColor = labelColors.YELLOW_700
          headingLabel.style.color = labelColors.NEUTRAL_900
          break
        case '<H2>':
          headingLabel.style.backgroundColor = labelColors.PURPLE_700
          break
        case '<H3>':
          headingLabel.style.backgroundColor = labelColors.GREEN_800
          break
        case '<H4>':
          headingLabel.style.backgroundColor = labelColors.BLUE_700
          break
        case '<H5>':
          headingLabel.style.backgroundColor = labelColors.RED_700
          break
        case '<H6>':
          headingLabel.style.backgroundColor = labelColors.NEUTRAL_700
          break
        default:
          break
      }

      const endLabel = headingLabel.cloneNode(true)
      endLabel.textContent = `</${heading.tagName}>`
      heading.appendChild(endLabel)
    })
  }
}

function hideHeadings() {
  const headingLabels = document.querySelectorAll('.heading-label')
  headingLabels.forEach((label) => label.remove())
}

window.addEventListener('message', (event) => {
  if (event.data === 'show-headings') {
    showHeadings()
  }

  if (event.data === 'hide-headings') {
    hideHeadings()
  }
})

function showListTags() {
  const listItems = document.querySelectorAll([
    'ul',
    'ol',
    'li',
    'dd',
    'dt',
    'dl',
  ])

  if (document.querySelectorAll('.list-item-label').length <= 0) {
    listItems.forEach((listItem) => {
      const listItemLabel = document.createElement('strong')
      listItemLabel.className = 'list-item-label'
      listItemLabel.style.color = labelColors.NEUTRAL_50
      listItemLabel.style.padding = '2px 4px'
      listItemLabel.style.margin = '4px'
      listItemLabel.style.fontSize = '12px'
      listItemLabel.style.fontWeight = 'bold'
      listItemLabel.style.borderRadius = '4px'
      listItemLabel.style.zIndex = '100000'
      listItemLabel.style.border = `1px solid ${labelColors.NEUTRAL_50}`
      listItemLabel.textContent = `<${listItem.tagName}>`
      listItemLabel.style.textTransform = 'lowercase'
      listItem.prepend(listItemLabel)

      switch (listItemLabel.textContent) {
        case '<UL>':
          listItemLabel.style.backgroundColor = labelColors.GREEN_800
          break
        case '<OL>':
          listItemLabel.style.backgroundColor = labelColors.YELLOW_700
          listItemLabel.style.color = labelColors.NEUTRAL_900
          break
        case '<LI>':
          listItemLabel.style.backgroundColor = labelColors.PURPLE_700
          break
        case '<DD>':
          listItemLabel.style.backgroundColor = labelColors.BLUE_700
          break
        case '<DT>':
          listItemLabel.style.backgroundColor = labelColors.RED_700
          break
        case '<DL>':
          listItemLabel.style.backgroundColor = labelColors.NEUTRAL_700
          break
        default:
          break
      }

      const endLabel = listItemLabel.cloneNode(true)
      endLabel.textContent = `</${listItem.tagName}>`
      listItem.appendChild(endLabel)
    })
  }
}

function hideListTags() {
  const listItemLabels = document.querySelectorAll('.list-item-label')
  listItemLabels.forEach((label) => label.remove())
}

window.addEventListener('message', (event) => {
  if (event.data === 'show-list-tags') {
    showListTags()
  }

  if (event.data === 'hide-list-tags') {
    hideListTags()
  }
})

function showLandMarks() {
  const landmarks = document.querySelectorAll(
    '[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="main"], [role="navigation"], [role="search"]'
  )

  const sections = document.querySelectorAll(
    'section, article, aside, nav, header, footer, form, main'
  )

  if (document.querySelectorAll('.landmark-label').length <= 0) {
    landmarks.forEach((landmark) => {
      const landmarkLabel = document.createElement('strong')
      landmarkLabel.className = 'landmark-label'
      landmarkLabel.style.backgroundColor = '#5928ed'
      landmarkLabel.style.color = labelColors.NEUTRAL_50
      landmarkLabel.style.padding = '2px 4px'
      landmarkLabel.style.margin = '4px'
      landmarkLabel.style.fontSize = '12px'
      landmarkLabel.style.fontWeight = 'bold'
      landmarkLabel.style.borderRadius = '4px'
      landmarkLabel.style.zIndex = '100000'
      landmarkLabel.style.border = `1px solid ${labelColors.NEUTRAL_50}`
      landmarkLabel.textContent = `<${landmark.getAttribute('role')}>`
      landmarkLabel.style.textTransform = 'lowercase'
      landmark.prepend(landmarkLabel)

      const endLabel = landmarkLabel.cloneNode(true)
      endLabel.textContent = `</${landmark.getAttribute('role')}>`
      landmark.appendChild(endLabel)
    })
  }

  if (document.querySelectorAll('.section-label').length <= 0) {
    sections.forEach((section) => {
      const sectionLabel = document.createElement('strong')
      sectionLabel.className = 'section-label'
      sectionLabel.style.backgroundColor = '#5928ed'
      sectionLabel.style.color = labelColors.NEUTRAL_50
      sectionLabel.style.padding = '2px 4px'
      sectionLabel.style.margin = '4px'
      sectionLabel.style.fontSize = '12px'
      sectionLabel.style.fontWeight = 'bold'
      sectionLabel.style.borderRadius = '4px'
      sectionLabel.style.zIndex = '100000'
      sectionLabel.style.border = `1px solid ${labelColors.NEUTRAL_50}`
      sectionLabel.textContent = `<${section.tagName}>`
      sectionLabel.style.textTransform = 'lowercase'
      section.prepend(sectionLabel)

      const endLabel = sectionLabel.cloneNode(true)
      endLabel.textContent = `</${section.tagName}>`
      section.appendChild(endLabel)
    })
  }
}

function hideLandMarks() {
  const landmarkLabels = document.querySelectorAll('.landmark-label')
  landmarkLabels.forEach((label) => label.remove())

  const sectionLabels = document.querySelectorAll('.section-label')
  sectionLabels.forEach((label) => label.remove())
}

window.addEventListener('message', (event) => {
  if (event.data === 'show-landmarks') {
    showLandMarks()
  }

  if (event.data === 'hide-landmarks') {
    hideLandMarks()
  }
})

function showAltText() {
  const images = document.querySelectorAll(['img', '[role="img"]'])

  if (document.querySelectorAll('.alt-text-label').length <= 0) {
    images.forEach((image) => {
      const altText = image.getAttribute('alt')
      const altTextLabel = document.createElement('strong')

      altTextLabel.className = 'alt-text-label'
      altTextLabel.style.backgroundColor = labelColors.PURPLE_700
      altTextLabel.style.position = 'absolute'
      altTextLabel.style.top = `${image.offsetTop}px`
      altTextLabel.style.left = `${image.offsetLeft}px`
      altTextLabel.style.minHeight = '24px'
      altTextLabel.style.color = labelColors.NEUTRAL_50
      altTextLabel.style.padding = '2px 4px'
      altTextLabel.style.margin = '4px'
      altTextLabel.style.fontSize = '12px'
      altTextLabel.style.fontWeight = 'bold'
      altTextLabel.style.borderRadius = '4px'
      altTextLabel.style.zIndex = '100000'
      altTextLabel.style.border = `1px solid ${labelColors.NEUTRAL_50}`
      altTextLabel.textContent = altText ? `alt = "${altText}"` : 'alt = ""'

      if (altTextLabel.textContent === 'alt = ""') {
        altTextLabel.style.backgroundColor = labelColors.RED_700
      }

      image.insertAdjacentHTML('beforebegin', altTextLabel.outerHTML)
    })
  }
}

function hideAltText() {
  const altTextLabels = document.querySelectorAll('.alt-text-label')
  altTextLabels.forEach((label) => label.remove())
}

window.addEventListener('message', (event) => {
  if (event.data === 'show-alt-text') {
    showAltText()
  }

  if (event.data === 'hide-alt-text') {
    hideAltText()
  }
})

function showLinks() {
  const links = document.querySelectorAll('a')

  if (document.querySelectorAll('.link-label').length <= 0) {
    links.forEach((link) => {
      const name = link.getAttribute('aria-labelledby')
      const startLabel = document.createElement('strong')
      startLabel.className = 'link-label'
      startLabel.style.backgroundColor = labelColors.PURPLE_700
      startLabel.style.color = labelColors.NEUTRAL_50
      startLabel.style.padding = '2px 4px'
      startLabel.style.margin = '4px'
      startLabel.style.fontSize = '12px'
      startLabel.style.fontWeight = 'bold'
      startLabel.style.borderRadius = '4px'
      startLabel.style.border = `1px solid ${labelColors.NEUTRAL_50}`
      startLabel.style.zIndex = '100000'
      link.prepend(startLabel)

      startLabel.textContent = name
        ? `<${link.tagName.toLowerCase()} name = "${name}">`
        : `<${link.tagName.toLowerCase()}> name = ""`

      if (
        startLabel.textContent === `<${link.tagName.toLowerCase()}> name = ""`
      ) {
        startLabel.style.backgroundColor = labelColors.RED_700
      }

      const endLabel = startLabel.cloneNode(true)
      endLabel.textContent = `</${link.tagName.toLowerCase()}>`
      link.appendChild(endLabel)
    })
  }
}

function hideLinks() {
  const linkLabels = document.querySelectorAll('.link-label')
  linkLabels.forEach((label) => label.remove())
}

window.addEventListener('message', (event) => {
  if (event.data === 'show-links') {
    showLinks()
  }

  if (event.data === 'hide-links') {
    hideLinks()
  }
})
