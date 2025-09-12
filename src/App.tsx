import { useState } from 'react'
import './App.css'
import { data } from './data'
import { sunIcon } from './svg/sun'
import Navbar from './components/Navbar/Navbar'
import {
  flattenArrayOfStrings,
  getConnectorPositions,
  getWordFromStrand,
  type Strand,
} from './utils'
import Clue from './components/Clue/Clue'

const { startingBoard, clue } = data
const width = startingBoard[0].length
const height = startingBoard.length

function App() {
  const [dragging, setDragging] = useState(false)
  const [currentStrand, setCurrentStrand] = useState<Strand>([])

  const letters = flattenArrayOfStrings(data.startingBoard)

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

  const currentWord = getWordFromStrand({
    strand: currentStrand,
    rows: data.startingBoard,
  })

  return (
    <>
      <Navbar />
      <Clue clue={clue} />
      <span style={{ minHeight: '1.5rem' }}>{currentWord ?? ' '}</span>
      <div
        className="grid"
        style={{
          gridTemplateRows: `repeat(${height}, 1fr)`,
          gridTemplateColumns: `repeat(${width}, 1fr)`,
        }}
        onMouseLeave={() => setCurrentStrand([])}
        onMouseUp={() => {
          setDragging(false)

          // console.log(
          //   getWordFromStrand({
          //     strand: currentStrand,
          //     rows: data.startingBoard,
          //   })
          // )

          setCurrentStrand([])
        }}
      >
        {letters.map((letter, idx) => {
          const row = ~~(idx / width)
          const col = idx % width

          const idxInCurrentStrand = currentStrand.findIndex(
            ([r, c]) => r === row && c === col
          )

          const inCurrentStrand = idxInCurrentStrand > -1

          const classes = inCurrentStrand
            ? `connector ${getConnectorPositions(
                currentStrand,
                idxInCurrentStrand
              )}`
            : ''

          return (
            <div
              className={`
                letter 
                ${classes} `}
              key={idx}
              style={{
                backgroundColor: inCurrentStrand
                  ? 'var(--current-strand)'
                  : 'unset',
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
