/**
 * Title: Constants
 * Description: Contains all constants which are used in this tetris project
 * Author: Md. Faizul Islam (faizul7cse@gmail.com)
 * Date: 18-05-2023 13:30
 */

export enum GameState {
    Ready = 0,
    Running = 1,
    Paused = 2,
    GameOver = 3
}

export enum MoveDirection {
    None = 9,
    Down = 1,
    Left = 2,
    Right = 3,
    Rotate = 4
}

export const Constants = {
    BLOCK_COLORS: 8,
    TETRIMINO_TEMPLATE_SIZE: 4,
    TETRIMINO_PATTERNS: [
        // Square Shape
        [
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ],
        // T-shapes
        [
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [1, 1, 0, 0],
                [0, 1, 0, 0]
            ]
        ],
        // Line shapes
        [
            [
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0]
            ]
        ],
        // L shapes
        [
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 1],
                [0, 1, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [1, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ],
        // Mirror L shapes
        [
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 1],
                [0, 0, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 0]
            ]
        ],
        // Z
        [
            [
                [0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0],
                [0, 1, 0, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 1],
                [0, 0, 0, 0]
            ]
        ],
        // mirror z
        [
            [
                [0, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 1, 1, 0],
                [0, 0, 1, 0]
            ],
            [
                [0, 0, 0, 0],
                [0, 0, 1, 1],
                [0, 1, 1, 0],
                [0, 0, 0, 0]
            ]
        ]
    ],
    EVENTS: {
        PLAY_TETRIS: 'play_tetris'
    },
    LOCAL_STORAGE_KEYS: {
        HighScore: 'high_score',
        GameLevel: 'game_level'
    }
};
