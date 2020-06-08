
const templateFunc = function (data) {
  var shared = '.icon { display: inline-block; vertical-align: middle; background-image: url(I) }'.replace(
    'I',
    data.sprites[0].image
  )
  var perSprite = data.sprites
    .map(function (sprite) {
      return '.icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
        .replace('N', sprite.name)
        .replace('W', sprite.width)
        .replace('H', sprite.height)
        .replace('X', sprite.offset_x)
        .replace('Y', sprite.offset_y)
    })
    .join('\n')
  return shared + '\n' + perSprite
}
module.exports = templateFunc
