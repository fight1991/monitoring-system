<template>
  <div class="clock-box">
    <canvas id="clock" :height="height + 'px'" :width="width + 'px'"></canvas>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      ctx: null,
      r: 0,
      rem: 0
    }
  },
  props: ['height', 'width'],
  mounted () {
    /*eslint-disable*/
    var dom = document.getElementById('clock');//获取dom元素
    this.ctx = dom.getContext('2d');//创建context对象
    this.r = this.width/2;
    this.rem = this.width/200;
    this.draw()
  },
  methods: {
    /*eslint-disable*/
    drawBackground(ctx, r, rem){
      ctx.save();//保存当前环境的状态
      ctx.translate(r,r);//重新映射画布上原点位置
      ctx.beginPath();//起始路径
      ctx.lineWidth = 4 * rem;//定义线条宽度
      ctx.arc(0,0,r - ctx.lineWidth/2,0,2*Math.PI,false);//创建圆
      ctx.strokeStyle = '#67C23A'
      ctx.stroke();//绘制路径
      
      var hourNumbers = [3,6,9,12];
      ctx.font = 18 * rem + 'px Arial';//设置字体
      ctx.textAlign = 'center';//文本内容对齐
      ctx.fillStyle = 'white'
      ctx.textBaseline = 'middle';//绘制文本时使用的当前文本基线
      //遍历时间
      hourNumbers.forEach(function(number,i){
        var rad = 2*Math.PI/4 * i;//弧度
        var x = Math.cos(rad) * (r - 35 * rem);//x坐标
        var y = Math.sin(rad) * (r - 35 * rem);//y坐标
        ctx.fillText(number,x,y);//填充文本
      });

      //绘制出60个点
      for(var i = 0;i < 60;i++){
        var rad = 2 * Math.PI/60 * i;
        var x = Math.cos(rad) * (r - 18 * rem);
        var y = Math.sin(rad) * (r - 18 * rem);
        ctx.beginPath();
        if(i % 5 === 0){
          ctx.fillStyle = 'yellow';
          ctx.arc(x,y,2 * rem,0,2*Math.PI,false);
        }else{
          ctx.fillStyle = 'transparent';
          ctx.arc(x,y,2 * rem,0,2*Math.PI,false);
        }
        ctx.fill();
      }
    },
    drawHour(ctx, r, rem, hour, minute){
      ctx.save();//保存当前环境的状态
      ctx.beginPath();//起始路径
      var rad = 2*Math.PI/12 * hour;//计算弧度
      var mrad = 2*Math.PI/12/60 * minute;
      ctx.rotate(rad+mrad);//旋转当前绘图
      ctx.lineWidth = 6 * rem;//定义时钟线宽度
      ctx.lineCap = 'round';//线条末端为圆形样式
      ctx.moveTo(0,10 * rem);//把路径移动到画布中的指定点，不创建线条
      ctx.lineTo(0,-r/2);//添加一个新点，然后在画布中创建从该点到最后指定点的线条
      ctx.strokeStyle = '#fe9200'
      ctx.stroke();//绘制已定义的路径
      ctx.restore();//返回之前保存过的路径状态和属性
    },
    drawMinute(ctx, r, rem, minute){
      ctx.save();//保存当前环境的状态
      ctx.beginPath();//起始路径
      var rad = 2*Math.PI/60 * minute;//计算弧度
      ctx.rotate(rad);//旋转当前绘图
      ctx.lineWidth = 4 * rem;//定义时钟线宽度
      ctx.lineCap = 'round';//线条末端为圆形样式
      ctx.moveTo(0,10 * rem);//把路径移动到画布中的指定点，不创建线条
      ctx.lineTo(0,-r + 30 * rem);//添加一个新点，然后在画布中创建从该点到最后指定点的线条
      ctx.stroke();//绘制已定义的路径
      ctx.restore();//返回之前保存过的路径状态和属性
    },
    drawSecond(ctx, r, rem, second){
      ctx.save();//保存当前环境的状态
      ctx.beginPath();//起始路径
      ctx.fillStyle = '#c14543';
      var rad = 2*Math.PI/60 * second;//计算弧度
      ctx.rotate(rad);//旋转当前绘图
      ctx.moveTo(-2 * rem,20 * rem);//把路径移动到画布中的指定点，不创建线条
      ctx.lineTo(2 * rem,20 * rem);//添加一个新点，然后在画布中创建从该点到最后指定点的线条
      ctx.lineTo(1,-r + 18 * rem);//添加一个新点，然后在画布中创建从该点到最后指定点的线条
      ctx.lineTo(-1,-r + 18 * rem);//添加一个新点，然后在画布中创建从该点到最后指定点的线条
      ctx.fill();//填充
      ctx.restore();//返回之前保存过的路径状态和属性
    },
    drawDot(ctx){
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(0,0,3,0,2*Math.PI,false);
      ctx.fill();
    },
    draw(){
      this.ctx.clearRect(0,0,this.width,this.height);
      var now = new Date();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      this.drawBackground(this.ctx, this.r, this.rem);
      this.drawHour(this.ctx, this.r, this.rem, hour, minute);
      this.drawMinute(this.ctx, this.r, this.rem, minute);
      this.drawSecond(this.ctx, this.r, this.rem, second);
      this.drawDot(this.ctx);
      this.ctx.restore();//返回之前保存过的路径状态和属性
    }
  }
}
</script>
<style lang='less' scoped>
//@import url(); 引入公共css类
</style>
