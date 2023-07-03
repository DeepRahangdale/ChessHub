import React, { useContext, useEffect, useReducer, useRef } from 'react';
import Cell from '../../components/Cell';
import { socket } from '../../socket';
import { Flex, createStyles } from '@mantine/core';
import { DndContext } from '@dnd-kit/core'
import { ChessGameContext } from '../../context/chess-game-context';

const useStyles = createStyles((theme) => ({
    chessboard: {
        [theme.fn.largerThan('md')]: {
            width: '600px'
        },

        [theme.fn.smallerThan('md')]: {
            width: '560px'
        },
        [theme.fn.smallerThan('sm')]: {
            width: '360px',
        },
    },
    boardrow: {
        [theme.fn.largerThan('md')]: {
            height: '75px'
        },
        [theme.fn.smallerThan('md')]: {
            height: '70px'
        },
        [theme.fn.smallerThan('sm')]: {
            height: '45px'
        },
    }
}))

const ChessBoard = ({ color }) => {
    const { classes } = useStyles();
    const { chessBoard, handleOpponentMove, handleDrop } = useContext(ChessGameContext)
    let roomID = localStorage.getItem('roomID');

    useEffect(() => {
        socket.on('opponent-move', handleOpponentMove)

        return () => {
            socket.off('opponent-move');
        }
    }, []);

    return (
        <DndContext onDragEnd={evt => {
            let from = evt.active.id;
            let to = evt.over.id;
            handleDrop({ from, to }, (moveData) => {
                socket.emit('move', roomID, moveData);
            })
        }}>
            <Flex className={classes.chessboard}>
                <div>
                    {chessBoard.map((row, rowIndex) => {
                        return (
                            <Flex className={classes.boardrow} key={rowIndex * 2}>
                                {row.map(cell => <Cell key={cell.square} cell={cell} />)}
                            </Flex>
                        )
                    })}
                </div>
            </Flex>
        </DndContext>
    )
}

export default ChessBoard