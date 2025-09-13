import { useLoaderData } from 'react-router-dom'
import { useState } from 'react'
import { type Game, type Strand } from '../../models/models'
import { matchStrands } from '../../utils'
import Board, { type DrawEvent } from '../Board/Board'
import Clue from '../Clue/Clue'
import HintButton from '../HintButton/HintButton'
import styles from './GamePage.module.scss'

const grayedOutText = 'color-mix(in hsl, var(--text-color) 80%, transparent)'

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

export default function GamePage() {
  const { startingBoard, clue, themeCoords, spangramCoords, solutions } =
    useLoaderData() as Game
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
  }

  const foundThemeStrands: Strand[] = foundWords.themeWords.map(
    (themeWord) => themeCoords[themeWord]
  )
  const foundSpangram: Strand = foundWords.spangram ? spangramCoords : []

  return (
    <>
      {/* <Navbar /> */}
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
          <HintButton percentage={100}>Hint</HintButton>
          <span>
            {foundWords.themeWords.length + (foundSpangram.length ? 1 : 0)} of{' '}
            {Object.keys(themeCoords).length + 1} theme words found.
          </span>
        </div>
      </div>
    </>
  )
}
