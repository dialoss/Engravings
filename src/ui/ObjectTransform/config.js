export const Transforms = [
    {
        name: 'bottom-left',
        axis: [1, 1],
        type: 'resize',
    },
    {
        name: 'bottom-right',
        axis: [1, 1],
        type: 'resize',
    },
    {
        name: 'right',
        axis: [1, 0],
        type: 'resize',
    },
    {
        name: 'left',
        axis: [1, 0],
        type: 'resize',
    },
    {
        name: 'bottom',
        axis: [0, 1],
        type: 'resize',
    },
];

export const Axis = {
    'bottom-left':[-1,1],
    'bottom-right':[1,1],
    'left':[-1,0],
    'right':[1,0],
    'bottom':[0, 1],
}