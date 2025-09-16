import { Link, useLoaderData } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { type Game, type Strand } from '../../models/models'
import { isGameCompleted, matchStrands } from '../../utils'
import Board, { type DrawEvent } from '../Board/Board'
import Clue from '../Clue/Clue'
import HintButton from '../HintButton/HintButton'
import styles from './GamePage.module.scss'
import games from '../../../games.json'

const grayedOutText = 'color-mix(in hsl, var(--text-color) 80%, transparent)'

export interface FoundWords {
  themeWords: string[]
  spangram: string
  other: string[]
  hintsUsed: number
}

interface Display {
  color: string
  animation: string
  text: string
}

export default function GamePage() {
  const game = useLoaderData() as Game
  const {
    startingBoard,
    clue,
    themeCoords,
    spangramCoords,
    solutions,
    id,
    printDate,
  } = game

  const [currentWord, setCurrentWord] = useState('')
  const [foundWords, setFoundWords] = useState<FoundWords>({
    themeWords: [],
    spangram: '',
    other: [],
    hintsUsed: 0,
  })
  const [display, setDisplay] = useState<Display>({
    text: '',
    animation: '',
    color: '',
  })
  const [hintStrand, setHintStrand] = useState<Strand>([])

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
      if (
        matchStrands(e.strand, themeCoords[themeWord]) &&
        e.word === themeWord
      ) {
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
      const newFoundWords: FoundWords = {
        ...foundWords,
        spangram: e.word,
      }
      setFoundWords(newFoundWords)
      localStorage.setItem(`strings-state-${id}`, JSON.stringify(newFoundWords))
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

      const newFoundWords: FoundWords = {
        ...foundWords,
        other: [...foundWords.other, e.word],
      }

      setFoundWords(newFoundWords)
      localStorage.setItem(`strings-state-${id}`, JSON.stringify(newFoundWords))

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

  const hintPercentage = Math.ceil(
    ((foundWords.other.length - foundWords.hintsUsed * 3) / 3) * 100
  )

  const handleHintClick = () => {
    const filtered = Object.keys(themeCoords).filter(
      (word) => !foundWords.themeWords.includes(word)
    )

    const randomThemeWord = filtered[~~(Math.random() * filtered.length)]

    const strand = themeCoords[randomThemeWord]

    setFoundWords((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }))
    setHintStrand(strand)
  }

  const getHintAndWordCount = (className: string) => (
    <div className={`${styles.hintAndWordCount} ${className}`}>
      <HintButton
        percentage={hintPercentage}
        onClick={handleHintClick}
        disabled={hintPercentage < 100}
      >
        Hint
      </HintButton>
      <span>
        {foundWords.themeWords.length + (foundSpangram.length ? 1 : 0)} of{' '}
        {Object.keys(themeCoords).length + 1} theme words found.
      </span>
    </div>
  )

  const getResetButton = (className: string) => (
    <button
      className={`${styles.resetButton} ${className}`}
      onClick={() => {
        setFoundWords({
          other: [],
          spangram: '',
          themeWords: [],
          hintsUsed: 0,
        })
        localStorage.removeItem(`strings-state-${id}`)
      }}
    >
      Reset?
    </button>
  )

  return (
    <>
      <div className={styles.header}>
        <h2 className={styles.date}>
          {new Date(printDate).toLocaleDateString('en-us', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </h2>
        <div className={styles.gameLinks}>
          {game.index > 0 && (
            <Link
              className={`hoverable-link ${styles.gameLink}`}
              to={`/games/${game.index - 1}`}
            >
              <span>&larr;</span> Previous Game
            </Link>
          )}
          {game.index + 1 < games.length && (
            <Link
              className={`hoverable-link ${styles.gameLink}`}
              to={`/games/${game.index + 1}`}
            >
              Next Game &rarr;
            </Link>
          )}
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.gameInfo}>
          <Clue className={styles.clue} clue={clue} />
          {getHintAndWordCount(styles.showOnLargeScreen)}
          {getResetButton(styles.showOnLargeScreen)}
        </div>
        <div>
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
            hintStrand={hintStrand}
            disabled={isGameCompleted(foundWords, game)}
          />
          {getHintAndWordCount(styles.hideOnLargeScreen)}
        </div>
        {getResetButton(styles.hideOnLargeScreen)}
      </div>
    </>
  )
}
