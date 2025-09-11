import { useState } from 'react'
import './App.css'
import { data } from './data'

type Coords = [number, number]

type Strand = Array<Coords>

const getWordFromStrand = ({
  strand,
  rows,
}: {
  strand: Strand
  rows: Array<string>
}) => {
  let res = ''
  strand.forEach(([r, c]) => {
    res += rows[r][c]
  })
  return res
}

type ConnectorPosition =
  | ''
  | 'top'
  | 'topRight'
  | 'right'
  | 'bottomRight'
  | 'bottom'
  | 'bottomLeft'
  | 'left'
  | 'topLeft'

const getConnectorPosition = (
  start: Coords,
  end: Coords
): ConnectorPosition => {
  console.log(end)
  // position is applied to "start" coords

  const startR = start[0]
  const startC = start[1]

  const endR = end[0]
  const endC = end[1]

  if (startR < endR) {
    if (startC < endC) {
      return 'bottomLeft'
    }
    if (startC === endC) {
      return 'bottom'
    }
    if (startC > endC) {
      return 'bottomRight'
    }
  }

  if (startR === endR) {
    if (startC < endC) {
      return 'right'
    }
    if (startC === endC) {
      return ''
    }
    if (startC > endC) {
      return 'left'
    }
  }

  if (startR > endR) {
    if (startC < endC) {
      return 'topRight'
    }

    if (startC === endC) {
      return 'right'
    }

    if (startC > endC) {
      return 'topLeft'
    }
  }

  return ''
}

const getConnectorPositions = (strand: Strand, idx: number) => {
  if (strand.length <= 1) return ''
  // if (idx === 0) {
  //   return `${getConnectorPosition(strand[idx], strand[idx + 1])}`;
  // }
  // if (idx === strand.length - 1) {
  //   return `${getConnectorPosition(strand[idx], strand[idx - 1])}`;
  // }
  if (idx === 0) return ''

  return getConnectorPosition(strand[idx], strand[idx - 1])
}

function App() {
  const [dragging, setDragging] = useState(false)
  const [currentStrand, setCurrentStrand] = useState<Strand>([])

  const letters: string[] = []
  let r = 0
  while (r < data.startingBoard.length) {
    let c = 0
    while (c < data.startingBoard[r].length) {
      letters.push(data.startingBoard[r][c])
      c++
    }
    r++
  }

  const mouseEnter = (strand: Strand, row: number, col: number) => {
    if (!dragging) return

    const coordAlreadyInStrand = strand.findIndex(
      ([r, c]) => r === row && c === col
    )
    if (coordAlreadyInStrand !== -1) {
      setCurrentStrand((prev) => [...prev].slice(0, coordAlreadyInStrand + 1))
      return
    }

    setCurrentStrand((prev) => [...prev, [row, col]])
  }

  return (
    <>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${data.startingBoard.length}, 1fr)`,
          gridTemplateColumns: `repeat(${data.startingBoard[0].length}, 1fr)`,
        }}
        onMouseLeave={() => setCurrentStrand([])}
        onMouseUp={() => {
          setDragging(false)

          console.log(
            getWordFromStrand({
              strand: currentStrand,
              rows: data.startingBoard,
            })
          )

          setCurrentStrand([])
        }}
      >
        {letters.map((letter, idx) => {
          const row = ~~(idx / data.startingBoard[0].length)
          const col = idx % data.startingBoard[0].length

          const idxInCurrentStrand = currentStrand.findIndex(
            ([r, c]) => r === row && c === col
          )

          const inCurrentStrand = idxInCurrentStrand > -1

          return (
            <div
              className={`
                letter 
                ${
                  inCurrentStrand
                    ? 'connector' +
                      ' ' +
                      getConnectorPositions(currentStrand, idxInCurrentStrand)
                    : ''
                } `}
              key={idx}
              style={{
                backgroundColor: inCurrentStrand ? 'pink' : 'unset',
              }}
              onMouseDown={() => {
                setDragging(true)
                setCurrentStrand([[row, col]])
              }}
              onMouseEnter={() => {
                mouseEnter(currentStrand, row, col)
              }}
            >
              {letter}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default App
