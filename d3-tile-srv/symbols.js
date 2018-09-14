
const minus = [
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    1, 1, 1, 1,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
];

const zero = [
    0, 1, 1, 0,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    0, 1, 1, 0
];

const one = [
    0, 0, 1, 0,
    0, 1, 1, 0,
    1, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    1, 1, 1, 1
];

const _symbols = {};
_symbols["-"] = minus;
_symbols["0"] = zero;
_symbols["1"] = one;

const symbolsHeight = 7;
const symbolsWidth = 4;
const symbolsSpacing = 2;

function getPixel(symbol, x, y)
{
    if ((x + y) < (symbolsHeight + symbolsWidth))
        return symbol[x+symbolsWidth*y];
    else
        return 0;
}

function getSymbols(str)
{
    let ss = [];
    str.split('').map(l => ss.push(_symbols[l]));
    return ss;
}

module.exports = {
    getSymbols: getSymbols,
    symbolsHeight: symbolsHeight,
    symbolsWidth: symbolsWidth,
    symbolsSpacing: symbolsSpacing,
    getPixel: getPixel
};