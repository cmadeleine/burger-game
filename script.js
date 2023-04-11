document.addEventListener("DOMContentLoaded", function() {

    console.log("page finished loading");

    new Vue({

        el: "#app",

        template: `
        <div id="app">


            <div class="stats">
                <div class="stat">
                    <span style="font-size: 14px;">money:</span>
                    <span>{{money}}</span>
                </div>
                <div class="stat">
                    <span style="font-size: 14px;">burgers made:</span>
                    <span>{{burgers}}</span>
                </div>
                <div class="stat" style="display:block;">
                    <div class="bar" id="bar">
                    </div>
                    <div class="stat" style="position:absolute; border:none;">
                        <span style="font-size: 14px;">XP:</span>
                        <span>{{xp}}</span>
                    </div>
                </div>
                <div class="time">
                    <span class="material-symbols-outlined" style="margin-left:10px;">
                        nest_clock_farsight_analog
                    </span>
                    <span style="align-self:center;">
                        {{hr}}:{{('0' + min).slice(-2)}}
                        
                    </span>
                </div>
                <button @click="buyXP" disabled=true class="buy xp" id="xpBtn">
                    <span>buy XP: $100</span>
                </button>
                <button @click="buySter" disabled=true class="buy ster" id="sterBtn">
                    <span>buy steroids: $200</span>
                </button>
                <button @click="bribeBoss" disabled=true class="buy bribe" id="bribeBtn">
                    <span style="font-size:13px;">"favor" for boss: 100 XP</span>
                </button>
            </div>
            <div class="container">
                <div id="burger">
                    <img class="burgerPic" id="burger1" src="./resources/burger_1.png">
                    <img class="burgerPic" id="burger2" src="./resources/burger_2.png">
                    <img class="burgerPic" id="burger3" src="./resources/burger_3.png">
                    <img class="burgerPic" id="burger0" src="./resources/burger_0.jpg">
                </div>

                <button id="burgerBtn" class="btn" @click="makeBurger">
                <span>make burgers</span>
                </button>

            </div>

            <div class="popup" id="popup">
                <div class="dialogue" id="dialogue">
                    <img class="burgerPic" src="./resources/burger_3.png" style="opacity:5%; width:500px; height:500px; margin-top: 100px;">
                    <span style="font-size:30px; text-align:center; margin-top:80px;"> You are the burger champion!!! 
                    Your burger-making prowess is felt and revered by all. 
                    You are the Alpha and the Omega, 
                    the First and the Last, 
                    the Beginning and the End. 
                    Go now. Be free.
                    </span>
                
                </div>
                <div class="night" id="night">
                    <span style="font-size:30px;">END OF DAY</span>
                    <span style="font-size:24px;" id="payRate">8 hrs * $7.50/hr = 
                        <span style="color:green; font-size:30px;"> $60</span>
                    </span>
            
                    <button @click="endDay" class="btn"><span>continue</span></button>
                </div>
                <div class="day" id="day">
                    <span style="font-size:30px;" id="dayText">DAY 1</span>
                    <button @click="startDay" class="btn"><span>start</span></button>
                </div>
            </div>

            <div class="events" id="events"></div>
        </div>
        
        `,
        
        methods: {
            makeBurger() {
                events = document.getElementById("events")
                ev = document.createElement("div")
                ev.innerHTML = "<span>You made " + this.burgRate + " burger(s)!</span>"
                events.prepend(ev)
                
                this.cooldown = 1;
                document.getElementById("burgerBtn").disabled = true;

                document.getElementById("burger0").style.opacity = "0%";
                setTimeout(function(){document.getElementById("burger1").style.opacity = "100%";}, 125);
                setTimeout(function(){document.getElementById("burger2").style.opacity = "100%";}, 250);
                setTimeout(function(){document.getElementById("burger3").style.opacity = "100%";}, 375);
                setTimeout(function(){
                    document.getElementById("burger0").style.opacity = "100%";
                    document.getElementById("burger1").style.opacity = "0%";
                    document.getElementById("burger2").style.opacity = "0%";
                    document.getElementById("burger3").style.opacity = "0%";
                }, 500);

            },

            buyXP() {
                events = document.getElementById("events")
                ev = document.createElement("div")
                ev.innerHTML = "<span>You bought 10 XP!</span>"
                events.prepend(ev)

                this.money -= 100;
                localStorage.setItem("money", this.money);
                this.xp += 10;

                if (this.xp >= this.xpCap) {
                    this.xp = this.xpCap;
                    console.log("xp maxxed")

                    this.paused = true;
                    document.getElementById("popup").style.visibility = "visible";
                    document.getElementById("dialogue").style.visibility = "visible";
                }

                if (this.xp >= 100) {
                    document.getElementById("bribeBtn").disabled = false;
                }

                localStorage.setItem("xp", this.xp);
                document.getElementById("bar").style.width = 150 *(this.xp / this.xpCap) + "px";

                if (this.money < 200) {
                    document.getElementById("sterBtn").disabled = true;
                    if (this.money < 100) {
                        document.getElementById("xpBtn").disabled = true;
                    }
                }
                
            },

            buySter() {
                this.money -= 200;
                localStorage.setItem("money", this.money);
                this.burgRate += 1;
                localStorage.setItem("burgRate", this.burgRate);

                events = document.getElementById("events")
                ev = document.createElement("div")
                ev.innerHTML = "<span>You bought steroids! You can now make " + this.burgRate + " burgers at a time.</span>"
                events.prepend(ev)

                if (this.money < 200) {
                    document.getElementById("sterBtn").disabled = true;
                    if (this.money < 100) {
                        document.getElementById("xpBtn").disabled = true;
                    }
                }
                
            },

            bribeBoss() {
                this.xp -= 100;
                localStorage.setItem("xp", this.xp);
                document.getElementById("bar").style.width = 150 *(this.xp / this.xpCap) + "px";
                
                this.payRate += 7.50;

                events = document.getElementById("events")
                ev = document.createElement("div")
                ev.innerHTML = "<span>You did a \"favor\" for your boss! You now make $" + this.payRate + "/hr.</span>"
                events.prepend(ev)

                //console.log("You did a \"favor\" for your boss and got a raise!")
                localStorage.setItem("payRate", this.payRate);

                if (this.xp < 100) {
                    document.getElementById("bribeBtn").disabled = true;
                }
                
            },


            startDay() {
                console.log("start day")

                this.paused = false;
                document.getElementById("popup").style.visibility = "hidden";
                document.getElementById("day").style.visibility = "hidden";
                
            },

            endDay() {

                events = document.getElementById("events")

                while (events.firstChild) {
                    events.removeChild(events.firstChild);
                }
                
                document.body.style.opacity = "0%";
                document.body.style.backgroundColor = "#111122";
                this.date.setHours(this.date.getHours() + 16);
                this.day += 1;
                localStorage.setItem("day", this.day);
                this.hr = 9;
                this.burgers = 0;
                this.money += 8 * this.payRate;
                localStorage.setItem("money", this.money);
                if (this.money >= 100) {
                    document.getElementById("xpBtn").disabled = false;
                }
                if (this.money >= 200) {
                    document.getElementById("sterBtn").disabled = false;
                }
                document.getElementById("dayText").innerHTML = "DAY " + this.day;
                setTimeout(function(){
                    document.getElementById("night").style.visibility = "hidden";
                    document.getElementById("day").style.visibility = "visible";
                    document.body.style.opacity = "100%";
                    document.body.style.backgroundColor = "white";}, 1000);
                

            },



        },

        mounted() {
            
            document.getElementById("day").style.visibility = "visible";
            document.getElementById("night").style.visibility = "hidden";

            if (!localStorage.getItem("money")) {
                localStorage.setItem("money", 0);
            }
            else {
                this.money = parseInt(localStorage.getItem("money"));
                if (this.money >= 100) {
                    document.getElementById("xpBtn").disabled = false;
                }
                if (this.money >= 200) {
                    document.getElementById("sterBtn").disabled = false;
                }
            }

            if (!localStorage.getItem("day")) {
                localStorage.setItem("day", 1);
            }
            else {
                this.day = parseInt(localStorage.getItem("day"));
                document.getElementById("dayText").innerHTML = "DAY " + this.day;
            }

            if (!localStorage.getItem("xp")) {
                localStorage.setItem("xp", 0);
            }
            else {
                this.xp = parseInt(localStorage.getItem("xp"));
                document.getElementById("bar").style.width = 150 *(this.xp / this.xpCap) + "px";
                if (this.xp >= 100) {
                    document.getElementById("bribeBtn").disabled = false;
                }
            }

            if (!localStorage.getItem("burgRate")) {
                localStorage.setItem("burgRate", 1);
            }
            else {
                this.burgRate = parseInt(localStorage.getItem("burgRate"));
            }

            if (!localStorage.getItem("payRate")) {
                localStorage.setItem("payRate", 7.50);
            }
            else {
                this.payRate = Number(localStorage.getItem("payRate"));
            }


            document.getElementById("popup").style.visibility = "visible";

            setInterval(() => {

                if (!this.paused) {

                    console.log("tick")
   
                    if (this.date.getHours() == 17) {
                        this.paused = true;

                        document.getElementById("payRate").innerHTML = "8 hrs * $" + this.payRate + "/hr = " +
                        "<span style=\"color:green; font-size:30px;\"> $" + 8 * this.payRate + "</span>";

                        document.getElementById("popup").style.visibility = "visible";
                        document.getElementById("night").style.visibility = "visible";
                    }
                    else {
                        this.min += 15;
                        this.date.setMinutes(this.date.getMinutes() + 15);
                        this.hr = this.date.getHours();
                        
                        
                        if (this.min >= 60) {
                            this.min = 0;
                        }
                    }

                    if (this.cooldown == 0) {
                        document.getElementById("burgerBtn").disabled = false;
                        this.burgers += 1 * this.burgRate;
                        this.xp += 1 * this.burgRate;
                        localStorage.setItem("xp", this.xp);

                        if (this.xp >= 100) {
                            document.getElementById("bribeBtn").disabled = false;
                        }
                        document.getElementById("bar").style.width = 150 *(this.xp / this.xpCap) + "px";
                        this.cooldown -= 1;

                        if (this.xp >= this.xpCap) {
                            this.xp = this.xpCap;
                            document.getElementById("bar").style.width = 150 *(this.xp / this.xpCap) + "px";
                            console.log("xp maxxed")

                            this.paused = true;
                            document.getElementById("popup").style.visibility = "visible";
                            document.getElementById("dialogue").style.visibility = "visible";
                        }
                    }
                    else if (this.cooldown > 0) {
                        this.cooldown -= 1;
                    }
                }
                
            }, 500);
        },

        data() {
            return {
                money: 0,
                payRate: 7.50,
                burgers: 0,
                burgRate: 1,
                day: 1,
                hr: 9, 
                min: 0,
                xp: 0,
                xpCap: 500,
                paused: true,
                cooldown: -1,
                date: new Date(2000, 0, 1, 9, 0, 0, 0)
            }
        },
        
    });
});

