import { useState } from 'react'
import { data } from './data.tsx'
import Navbar from './components/Navbar/Navbar.tsx'
import Clue from './components/Clue/Clue'
import styles from './App.module.scss'
import { matchStrands, type Strand } from './utils'
import type { DrawEvent } from './components/Board/Board.tsx'
import Board from './components/Board/Board.tsx'
import HintButton from './components/HintButton/HintButton.tsx'

const grayedOutText = 'color-mix(in hsl, var(--text-color) 80%, transparent)'

const { startingBoard, clue, themeCoords, spangramCoords, solutions } = data

interface FoundWords {
  themeWords: string[]
  spangram: string
  other: Set<string>
}

interface Result {
  color: string
  animation: string
  result: string
}

function App() {
  const [currentWord, setCurrentWord] = useState('')
  const [foundWords, setFoundWords] = useState<FoundWords>({
    themeWords: [],
    spangram: '',
    other: new Set<string>(),
  })
  const [result, setResult] = useState<Result>({
    result: '',
    animation: '',
    color: '',
  })

  const setResultAfterTimeout = (res: Result) => {
    setTimeout(() => {
      setResult(res)
    }, 500)
  }

  const handleConfirm = (e: DrawEvent) => {
    // check length
    if (e.word.length <= 3) {
      setResult({
        result: 'Too short',
        animation: styles.shake,
        color: '',
      })

      setResultAfterTimeout({
        result: 'Too short',
        animation: '',
        color: grayedOutText,
      })

      return
    }

    // check themeWords
    for (const themeWord in themeCoords) {
      if (matchStrands(e.strand, themeCoords[themeWord])) {
        if (foundWords.themeWords.includes(themeWord)) {
          setResultAfterTimeout({
            result: 'Already found',
            animation: styles.shake,
            color: grayedOutText,
          })
          return
        }

        setResult({
          result: themeWord,
          animation: styles.bounce,
          color: 'var(--readable-theme-word)',
        })
        setFoundWords((prev) => ({
          ...prev,
          themeWords: [...prev.themeWords, themeWord],
        }))
        return
      }
    }

    // check spangram
    if (matchStrands(e.strand, spangramCoords)) {
      if (foundWords.spangram === e.word) {
        setResultAfterTimeout({
          result: 'Already found',
          animation: styles.shake,
          color: grayedOutText,
        })
        return
      }

      setResult({
        result: e.word,
        animation: styles.bounce,
        color: 'var(--spangram)',
      })
      setFoundWords((prev) => ({
        ...prev,
        spangram: e.word,
      }))
      return
    }

    // check already found
    if (foundWords.other.has(e.word)) {
      setResult({
        result: 'Already found',
        animation: styles.shake,
        color: grayedOutText,
      })

      return
    }

    // check solutions
    if (solutions.includes(e.word)) {
      setResult({
        result: e.word,
        animation: styles.bounce,
        color: grayedOutText,
      })

      setFoundWords((prev) => ({
        ...prev,
        other: new Set([...prev.other, e.word]),
      }))

      return
    }

    // not a word
    setResult({
      result: 'Not in word list',
      animation: styles.shake,
      color: grayedOutText,
    })

    console.log(foundWords.other)
  }

  const foundThemeStrands: Strand[] = foundWords.themeWords.map(
    (themeWord) => themeCoords[themeWord]
  )
  const foundSpangram: Strand = foundWords.spangram ? spangramCoords : []

  return (
    <>
      <Navbar />
      <div className={styles.content}>
        <Clue clue={clue} />
        {currentWord ? (
          <span className={styles.result}>{currentWord}</span>
        ) : (
          <span
            className={`
          ${styles.result}
          ${result.animation}
          `}
            style={{ color: result.color }}
          >
            {result.result}
          </span>
        )}
        <Board
          rows={startingBoard}
          onDraw={(e) => {
            setCurrentWord(e.word)
          }}
          onConfirm={handleConfirm}
          foundThemeStrands={foundThemeStrands}
          foundSpangram={foundSpangram}
        />
        <div className={styles.boardFooter}>
          <HintButton>Hint</HintButton>
          <span>
            {foundWords.themeWords.length} of {Object.keys(themeCoords).length}{' '}
            theme words found.
          </span>
        </div>
      </div>
    </>
  )
}

export default App
