import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Point} from '../point';
import {UserService} from "../service/user.service";
import {TokenService} from "../token/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-shoot',
  templateUrl: './shoot.component.html',
  styleUrls: ['./shoot.component.css']
})
export class ShootComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas: ElementRef;

  @ViewChild('results', { static: true })
  table: ElementRef;
  private ctx: CanvasRenderingContext2D;

  point: Point = new Point();
  points: Array<Point> = new Array<Point>();
  private username: any;
  private radius: number = 0;

  constructor(private userService: UserService, private tokenService: TokenService,private router: Router) {

  }

  ngOnInit(): void {
    //console.log(this.tokenService.getToken());
    if (this.tokenService.getToken() != null){
      //console.log(this.tokenService.getToken());
      this.getPoints();
      this.draw(2);
      this.username = this.tokenService.getUser();
    }else{
      alert("You're not registered");
      this.router.navigate(["/"]);
    }

  }

  public getPoints() {
    this.userService.start().subscribe((res: any) => {
      this.points = res;

      this.points.forEach(element=>
        this.addRow(element.x, element.y, element.r, element.result, element.timeOfSending, element.timeOfExecuting)
      )
    });

  }

  public sendPoint(){
    let x = this.point.x;
    let y = this.point.y;
    let r = this.point.r;
    if (isNaN(Number(x)) || Number(x)<-3 || Number(x)>3){
      alert("X must be between -3 and 3")
    }else{
      if (isNaN(Number(y)) || Number(y)<-3 || Number(y)>5){
        alert("Y must be between -3 and 5")
      }else{
        if (isNaN(Number(r)) || Number(r)<1 || Number(r)>3){
          alert("R must be between 1 and 3")
        }else{
          const data = { x: x, y: y, r: r};
          let point: Point;
          this.point = this.userService.shoot(data).subscribe((data:any)=>{
            point = data;
            this.draw(point.r);
            this.points.push(point);

            this.addRow(point.x, point.y, point.r, point.result, point.timeOfSending, point.timeOfExecuting);
            //console.log(this.points);
            this.drawAllPointsForThisRadius(point.r);
            this.drawPoint(point);
          });
        }
      }
    }
  }

  private addRow(x: number, y: number, r: number, result: boolean, timeOfSending: string, timeOfExecuting: number) {
    // @ts-ignore
    let tbody = document.getElementById("results").getElementsByTagName("tbody")[0];
    let row = document.createElement("tr");

    let tdX = document.createElement("td");
    tdX.appendChild(document.createTextNode(x.toString()));

    let tdY = document.createElement("td");
    tdY.appendChild(document.createTextNode(y.toString()));

    let tdR = document.createElement("td");
    tdR.appendChild(document.createTextNode(r.toString()));

    let tdResult = document.createElement("td");
    if (result){
      tdResult.appendChild(document.createTextNode("true"));
    }else{
      tdResult.appendChild(document.createTextNode("false"));
    }


    let tdTime = document.createElement("td");
    tdTime.appendChild(document.createTextNode(timeOfSending));

    let tdDelta = document.createElement("td");
    tdDelta.appendChild(document.createTextNode(timeOfExecuting.toString()));

    row.appendChild(tdX);
    row.appendChild(tdY);
    row.appendChild(tdR);
    row.appendChild(tdResult);
    row.appendChild(tdTime);
    row.appendChild(tdDelta);
    tbody.appendChild(row);
  }



  private draw(coef:number){
    this.ctx = this.canvas.nativeElement.getContext('2d');
    let width = 310;
    let height  = 310;
    this.ctx.strokeStyle = 'black';
    this.ctx.fillStyle = 'white';
    this.ctx.globalAlpha = 1.0;
    this.ctx.fillRect(0, 0, width, height);
    this.drawAxis(this.ctx,width,height,coef);
    this.drawText(this.ctx,width,height);
  }
  private drawPoint(point: Point){
    let x_draw = point.x*30 + 310/2;
    let y_draw = 310/2 - point.y*30;
    this.ctx.beginPath();
    this.ctx.arc(x_draw,y_draw,2.5,0, Math.PI*2);
    this.ctx.closePath();
    let result = point.result;
    if(result){
      this.ctx.strokeStyle = "green";
      this.ctx.fillStyle = "green";
    }else{
      this.ctx.strokeStyle = "red";
      this.ctx.fillStyle = "red";
    }
    this.ctx.fill();
    this.ctx.stroke();
  }
  drawAxis(ctx:CanvasRenderingContext2D, width: number, height:number, coeff: number) : void{
    //rec
    ctx.beginPath();
    ctx.moveTo(65+(3-coeff)*30,height/2);
    ctx.lineTo(65+(3-coeff)*30, height-(3-coeff)*30 - 65);
    ctx.lineTo(width/2, height-(3-coeff)*30 - 65);
    ctx.lineTo(width/2, height/2);
    ctx.closePath();
    ctx.strokeStyle = "blue";
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.stroke();

    //arc
    ctx.beginPath();
    ctx.moveTo(width/2,height/2);
    ctx.arc(width/2,height/2,coeff*30,Math.PI, 1.5*Math.PI,false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    //triangle
    ctx.beginPath();
    ctx.moveTo(width/2,height/2+30*coeff/2);
    ctx.lineTo(width/2, height/2);
    ctx.lineTo(width/2+30*coeff, height/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    //Y
    ctx.beginPath();
    ctx.moveTo(width/2,0);
    ctx.lineTo(width/2, height);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();

    //X
    ctx.beginPath();
    ctx.moveTo(0,height/2);
    ctx.lineTo(width, height/2);
    ctx.closePath();
    ctx.stroke();
  }
  drawText(ctx:CanvasRenderingContext2D, width: number, height:number) : void{
    ctx.font = "bold 7.5px Verdana";
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.fillText("5",width/2+2.5,7.5);
    ctx.fillText("4",width/2+2.5,35);
    ctx.fillText("3",width/2+2.5,65);
    ctx.fillText("2",width/2+2.5,95);
    ctx.fillText("1",width/2+2.5,125);

    ctx.fillText("-1",width/2+2.5,185);
    ctx.fillText("-2",width/2+2.5,215);
    ctx.fillText("-3",width/2+2.5,245);
    ctx.fillText("-4",width/2+2.5,275);
    ctx.fillText("-5",width/2+2.5,305);

    ctx.fillText("0",width/2+2.5,height/2+10);

    ctx.fillText("-5",5,height/2+10);
    ctx.fillText("-4",35,height/2+10);
    ctx.fillText("-3",65,height/2+10);
    ctx.fillText("-2",95,height/2+10);
    ctx.fillText("-1",125,height/2+10);
    ctx.fillText("1",185,height/2+10);
    ctx.fillText("2",215,height/2+10);
    ctx.fillText("3",245,height/2+10);
    ctx.fillText("4",275,height/2+10);
    ctx.fillText("5",302.5,height/2+10);
  }

  public logout(){
    this.router.navigate(["/"]);
    this.tokenService.signOut();
  }

  setRadius() {
    this.radius = this.point.r;
    this.draw(this.radius);
    this.drawAllPointsForThisRadius(this.radius);
  }

  private drawAllPointsForThisRadius(radius: number) {
    //console.log(this.points);
    this.points.forEach(element=> {
      if (element.r == radius){
        let x = 310/2 + 30*element.x;
        let y = 310/2 - 30*element.y;
        let result = element.result;
        this.ctx.beginPath();
        this.ctx.arc(x,y,2.5,0, Math.PI*2);
        this.ctx.closePath();
        if (result){
          this.ctx.strokeStyle = "green";
          this.ctx.fillStyle = "green";
        }else{
          this.ctx.strokeStyle = "red";
          this.ctx.fillStyle = "red";
        }
        this.ctx.fill();
        this.ctx.stroke();
      }
    })
  }

  shoot(event: MouseEvent) {
    if (this.radius != 0){
      let x = ((event.offsetX-155)/30).toFixed(3);
      let y = ((155-event.offsetY)/30).toFixed(3);
      let r = this.radius;
      console.log(this.point.r);
      const data = { x: x, y: y, r: r};
      let point: Point;
      this.userService.shoot(data).subscribe((data:any)=>{
        point = data;
        this.draw(point.r);
        this.points.push(point);

        this.addRow(point.x, point.y, point.r, point.result, point.timeOfSending, point.timeOfExecuting);
        //console.log(this.points);
        this.drawAllPointsForThisRadius(point.r);
        //this.drawPoint(point);
        event.preventDefault();
      });
    }else{
      alert("Set radius firstly")
    }


  }
}
