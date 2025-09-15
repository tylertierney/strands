import { useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
  other: string[]
}

interface Display {
  color: string
  animation: string
  text: string
}

export default function GamePage() {
  const { startingBoard, clue, themeCoords, spangramCoords, solutions, id } =
    useLoaderData() as Game
  const [currentWord, setCurrentWord] = useState('')
  const [foundWords, setFoundWords] = useState<FoundWords>({
    themeWords: [],
    spangram: '',
    other: [],
  })
  const [display, setDisplay] = useState<Display>({
    text: '',
    animation: '',
    color: '',
  })

  const setDisplayAfterTimeout = (res: Display) => {
    setTimeout(() => {
      setDisplay(res)
    }, 500)
  }

  const handleConfirm = (e: DrawEvent) => {
    // check length
    if (e.word.length <= 3) {
      setDisplay({
        text: 'Too short',
        animation: styles.shake,
        color: '',
      })

      setDisplayAfterTimeout({
        text: 'Too short',
        animation: '',
        color: grayedOutText,
      })

      return
    }

    // check themeWords
    for (const themeWord in themeCoords) {
      if (matchStrands(e.strand, themeCoords[themeWord])) {
        if (foundWords.themeWords.includes(themeWord)) {
          setDisplayAfterTimeout({
            text: 'Already found',
            animation: styles.shake,
            color: grayedOutText,
          })
          return
        }

        setDisplay({
          text: themeWord,
          animation: styles.bounce,
          color: 'var(--readable-theme-word)',
        })
        const newFoundWords: FoundWords = {
          ...foundWords,
          themeWords: [...foundWords.themeWords, themeWord],
        }
        setFoundWords(newFoundWords)
        localStorage.setItem(
          `strings-state-${id}`,
          JSON.stringify(newFoundWords)
        )
        return
      }
    }

    // check spangram
    if (matchStrands(e.strand, spangramCoords)) {
      if (foundWords.spangram === e.word) {
        setDisplayAfterTimeout({
          text: 'Already found',
          animation: styles.shake,
          color: grayedOutText,
        })
        return
      }

      setDisplay({
        text: e.word,
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
    if (foundWords.other.includes(e.word)) {
      setDisplay({
        text: 'Already found',
        animation: styles.shake,
        color: grayedOutText,
      })

      return
    }

    // check solutions
    if (solutions.includes(e.word)) {
      setDisplay({
        text: e.word,
        animation: styles.bounce,
        color: grayedOutText,
      })

      setFoundWords((prev) => ({
        ...prev,
        other: [...prev.other, e.word],
      }))

      return
    }

    // not a word
    setDisplay({
      text: 'Not in word list',
      animation: styles.shake,
      color: grayedOutText,
    })
  }

  useEffect(() => {
    const foundWordsFromLocal = localStorage.getItem(`strings-state-${id}`)
    if (foundWordsFromLocal) {
      const parsed = JSON.parse(foundWordsFromLocal) as FoundWords
      setFoundWords(parsed)
    }
  }, [id])

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
          <span className={styles.display}>{currentWord}</span>
        ) : (
          <span
            className={`
          ${styles.display}
          ${display.animation}
          `}
            style={{ color: display.color }}
          >
            {display.text}
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
        <button
          onClick={() => {
            setFoundWords({ other: [], spangram: '', themeWords: [] })
            localStorage.removeItem(`strings-state-${id}`)
          }}
        >
          Reset?
        </button>
      </div>
    </>
  )
}
