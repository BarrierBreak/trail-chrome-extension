import {Button} from '@trail-ui/react'
import {useState} from 'react'

interface Issues {
  issues: {
    errors: {
      code: string
      conformance_level: string
      criteria_name: string
      element: string
      failing_issue_variable: string
      failing_technique: string
      issues: {
        clip: {
          x: number
          y: number
          width: number
          height: number
        }
        clipBase64: string
        code: string
        context: string
        elementTagName: string
        message: string
        recurrence: number
        selector: string
        type: string
        typeCode: number
      }[]
      message: string
      occurences: string
      rule_name: string
      severity: string
    }[]
    warnings: {
      code: string
      conformance_level: string
      criteria_name: string
      element: string
      failing_issue_variable: string
      failing_technique: string
      issues: {
        clip: {
          x: number
          y: number
          width: number
          height: number
        }
        clipBase64: string
        code: string
        context: string
        elementTagName: string
        message: string
        recurrence: number
        selector: string
        type: string
        typeCode: number
      }[]
      message: string
      occurences: string
      rule_name: string
      severity: string
    }[]
  }
}

function Extension() {
  const [responseData, setResponseData] = useState<Issues>()
  const [isLoading, setIsLoading] = useState(false)
  const postData = async () => {
    setIsLoading(true)
    await fetch(
      'http://ec2-65-0-110-95.ap-south-1.compute.amazonaws.com:3000/audit',
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
          'x-api-key': `${import.meta.env.VITE_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: 'https://barrierbreak.com',
          element: '',
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data)
        setResponseData(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const handleClick = () => {
    window.parent.postMessage('close-button-clicked', '*')
  }

  const handleTestResults = () => {
    postData()
  }

  return (
    <>
      <div className="w-[600px]">
        <div className="flex justify-between items-center border-b border-neutral-300 pt-[6px] pr-[20px] pb-[6px] pl-[24px]">
          <div className="flex items-center">
            <svg
              className="mr-[6px]"
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M18.5832 30.6917V33.8094H21.3669V30.6917C21.3669 26.9047 22.542 25.1239 33.2625 25.1239H39.3376C37.0734 33.6855 29.2761 40 20.0009 40C10.7256 40 2.86291 33.6321 0.634856 25.0189H18.0739V22.235H0.125593C0.0412887 21.5003 0 20.7536 0 20C0 19.2464 0.0412887 18.4997 0.125593 17.765H6.65662C12.2999 17.765 15.4931 17.3107 17.6816 16.201C20.1729 14.9363 21.3343 12.7787 21.3343 9.41329V6.29215H18.5504V9.41329C18.5504 13.1968 17.3754 14.9811 6.65662 14.9811H0.634856C2.86119 6.36442 10.6878 0 20.0009 0C29.3139 0 37.2025 6.41432 39.3909 15.0843H21.8435V17.8682H39.8864C39.9621 18.5702 40 19.2791 40 20C40 20.7932 39.9518 21.5726 39.8641 22.3417H33.2625C23.5261 22.3417 18.5832 23.6339 18.5832 30.6934V30.6917Z"
                fill="#5928ED"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="39"
              height="16"
              viewBox="0 0 39 16"
              fill="none"
            >
              <path
                d="M0.101074 3.62114V1.40676H10.387V3.62114H6.4481V15.3021H3.95768V3.62114H0.101074Z"
                fill="#302E38"
              />
              <path
                d="M10.4897 4.79113H12.4895L12.7348 6.29492C13.1835 5.12492 14.1834 4.47626 15.2034 4.47626C15.8151 4.47626 16.4486 4.62251 16.8368 4.87372L16.4083 6.94186C15.9999 6.73367 15.4908 6.56505 14.9597 6.56505C13.8574 6.56505 13.1432 7.46319 13.1028 8.67448V15.2987H10.6746V6.4601L10.4914 4.78769L10.4897 4.79113Z"
                fill="#302E38"
              />
              <path
                d="M17.2451 10.4966C17.2451 6.81796 19.0213 4.47798 22.5301 4.47798C23.2241 4.47798 24.7129 4.64488 26.1632 5.20923V13.2959L26.3666 15.3021H24.2643L24.1214 14.1941L24.0391 14.1734C23.488 14.989 22.5906 15.6153 21.2227 15.6153C18.1408 15.6153 17.2434 13.234 17.2434 10.4966H17.2451ZM23.7753 11.9797V6.56849C23.4694 6.42224 22.8561 6.27599 22.2242 6.27599C20.285 6.27599 19.633 8.15658 19.633 10.414C19.633 12.1277 20.0615 13.7777 21.7554 13.7777C23.0611 13.7777 23.7753 12.8796 23.7753 11.9814V11.9797Z"
                fill="#302E38"
              />
              <path
                d="M28.5088 1.76119C28.5088 1.0093 29.0599 0.381287 29.8968 0.381287C30.7337 0.381287 31.305 0.986933 31.305 1.76119C31.305 2.53545 30.7135 3.16174 29.8968 3.16174C29.0801 3.16174 28.5088 2.57675 28.5088 1.76119ZM31.1218 4.79113V15.3021H28.6936V4.79113H31.1218Z"
                fill="#302E38"
              />
              <path
                d="M33.6531 11.8952V0.778549H36.1014V11.8539C36.1014 13.1701 36.367 13.6502 37.2038 13.6502C37.592 13.6502 38.0406 13.5039 38.4692 13.3164L39.0002 14.9888C38.4289 15.3863 37.4492 15.6151 36.572 15.6151C33.8178 15.6151 33.6531 13.7758 33.6531 11.8952Z"
                fill="#302E38"
              />
            </svg>
          </div>
          <button onClick={handleClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M16.0001 25.3333C10.8454 25.3333 6.66675 21.1546 6.66675 16C6.66675 10.8453 10.8454 6.66666 16.0001 6.66666C21.1547 6.66666 25.3334 10.8453 25.3334 16C25.3334 21.1546 21.1547 25.3333 16.0001 25.3333ZM16.0001 14.6801L13.3602 12.0402L12.0403 13.3601L14.6802 16L12.0403 18.6398L13.3602 19.9598L16.0001 17.3199L18.6399 19.9598L19.9598 18.6398L17.32 16L19.9598 13.3601L18.6399 12.0402L16.0001 14.6801Z"
                fill="#484453"
              />
            </svg>
          </button>
        </div>
        <div className="flex h-screen p-3">
          {responseData?.issues ? (
            <div>
              <h1 className="text-red-600 font-extrabold">Errors</h1>
              <ul>
                <table className="table border">
                  <th className="table-header-group border bg-neutral-100">
                    <td className="table-cell p-1">Element</td>
                    <td className="table-cell p-1">Screenshot</td>
                    <td className="table-cell p-1">Code</td>
                  </th>
                  <tbody>
                    {responseData?.issues.errors.map((issue) => (
                      <>
                        <tr className="border">
                          <td className="table-cell p-1" colSpan={3}>
                            <h2 className="font-semibold">{issue.message}</h2>
                          </td>
                        </tr>
                        {issue.issues.map((issue) => (
                          <tr className="table-row border">
                            <td className="table-cell border-r p-2">
                              {issue.elementTagName}
                            </td>
                            <td className="table-cell border-r  p-2">
                              <img
                                src={`data:image/png;base64,${issue.clipBase64}`}
                                alt="screenshot"
                              />
                            </td>
                            <td className="table-cell p-2">{issue.code}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </ul>
              <h1 className="font-bold text-yellow-800">Warnings</h1>
              <ul>
                <table className="table border">
                  <th className="table-header-group border bg-neutral-100">
                    <td className="table-cell p-1">Element</td>
                    <td className="table-cell p-1">Screenshot</td>
                    <td className="table-cell p-1">Code</td>
                  </th>
                  <tbody>
                    {responseData?.issues.warnings.map((issue) => (
                      <>
                        <tr className="border">
                          <td className="table-cell p-1" colSpan={3}>
                            <h2 className="font-semibold">{issue.message}</h2>
                          </td>
                        </tr>
                        {issue.issues.map((issue) => (
                          <tr className="table-row border">
                            <td className="table-cell border-r p-2">
                              {issue.elementTagName}
                            </td>
                            <td className="table-cell border-r  p-2">
                              <img
                                src={`data:image/png;base64,${issue.clipBase64}`}
                                alt="screenshot"
                              />
                            </td>
                            <td className="table-cell p-2">{issue.code}</td>
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </ul>
            </div>
          ) : (
            <Button
              appearance="primary"
              onPress={handleTestResults}
              isLoading={isLoading}
            >
              Test Website
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default Extension
