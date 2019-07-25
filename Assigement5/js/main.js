
    var npcData = [
    	["Girl", 1,  5,  5,"Wuuuu~~~|Can you help me to find my little brother？", 0, 0],
    	["Fool", 2, 18,  5,"Monster！Monster！|Wow, do you see the monster？", 0, 0],
    	["Villager", 3, 25,  5,"We are waiting for the hero to protect us！|Are you the hero？I dont think so。|I think the hero is very handsome like me~~~", 0, 0],
    	["Villager", 4,  5, 10,"Why nobody truths me……|I am the hero ！|Don't interrupt me!", 2, 1],
    	["The old village", 6, 15, 10,"I am too old to protect us。|Where can we find the Excalibur……", 1, 0]
    ];
    
    var monsterData = [
    	["Wof man",0,20,25,50,10,"Wa ooo……"],
    	["Cow blame",2,28,25,200,50,"Mo oo……"]
    ];
    var playerData = ["Hero",8,2,100,100,100,100,0,0]; 
    var weapons = [["backsword",10],["Iron Sword",50],["Excalibur",100]];
    var armors = [["Cloth",10],["Leather",50],["Armour",100]];

    var taskData = [
    	[9,0,1,1,"Nothing","……",0,0],
    	[0,0,1,0,"Kill wolf man","If you can kill the Wolf man, I will give you an iron sword。","Good job, you get an iron sword！",1,0],
    	[0,1,1,0,"Kill the cow blame","The cow blame is too ferocious, don't close to it！","Wow, nice, you get the Excalibur！",2,0]
    ];
    var fightingID = 0; 
    
    function GameMain(game){
    
    	var layer_1;
    	var player;
    	var npcs;
    	var directions = ["down","left","right","up"];
    	var facing = 0;
    	var touchLeft  = false;
    	var touchRight = false;
    	var touchUp    = false;
    	var touchDown  = false;
    	var fires;
    	var cursors;
    	var actKey;
    	var actTimer = 0;
    
    	var talkbox;
    	var talking = 0;
    	var talkingto = null;
    
    	this.create = function(){
    		game.physics.startSystem(Phaser.Physics.ARCADE); 
            
            this.music = this.add.audio('town');
		    this.music.play();
    		//load map
    		var map = game.add.tilemap('world-1');
    		map.addTilesetImage('tiles-2');
    
    		map.setCollision([21,22,221,222,251,271]);
    		layer_1 = map.createLayer('touchlayer');
    		layer_1.visible=false;
    		layer_1.resizeWorld();
    

    		game.add.sprite(0, 0, 'world-ground'); 
    
    		//Npc
    		npcs = game.add.group(); 
    		npcs.enableBody = true;  
    		for (idx in npcData){  
    			var img = (npcData[idx][1]%4)*3+parseInt(npcData[idx][1]/4)*48;
    			var npc = npcs.create(npcData[idx][2] * 32, npcData[idx][3] * 32, 'sheet-hero',img);  
    			npc.body.collideWorldBounds = true;  
    			npc.body.immovable = true;
    			npc.idx = idx;
    			npc.talking = false;
    			npc.timetomove = 0;
    			npc.animations.add('down', [0+img, 1+img, 2+img], 5, true); 
    			npc.animations.add('left', [12+img, 13+img, 14+img], 5, true); 
    			npc.animations.add('right', [24+img, 25+img, 26+img], 5, true); 
    			npc.animations.add('up', [36+img, 37+img, 38+img], 5, true); 
    		}
    		//Monster......
    		monsters = game.add.group(); 
    		monsters.enableBody = true;  
    		for (idx in monsterData){
    			var img = (monsterData[idx][1]%4)*3+parseInt(monsterData[idx][1]/4)*48;
    			var monster = monsters.create(monsterData[idx][2] * 32, monsterData[idx][3] * 32, 'sheet-monster',img);  
    			monster.body.collideWorldBounds = true;
    			monster.body.immovable = true;
    			monster.idx = idx;
    			monster.talking = false;
    			monster.timetomove = 0;
    			monster.animations.add('down', [0+img, 1+img, 2+img], 5, true); 
    			monster.animations.add('left', [12+img, 13+img, 14+img], 5, true); 
    			monster.animations.add('right', [24+img, 25+img, 26+img], 5, true); 
    			monster.animations.add('up', [36+img, 37+img, 38+img], 5, true); 
    			if(monsterData[idx][4]==0){monster.kill();}
    		}
           //PALYER
    		player = game.add.sprite(playerData[1]*32, playerData[2]*32, 'sheet-hero');
    		game.physics.arcade.enable(player,Phaser.Physics.ARCADE);
    		player.body.collideWorldBounds = true;
    		player.body.setSize(32,24,0,8);
    		player.animations.add('down', [0, 1, 2], 10, true);
    		player.animations.add('left', [12, 13, 14], 10, true); 
    		player.animations.add('right', [24, 25, 26], 10, true); 
    		player.animations.add('up', [36, 37, 38], 10, true); 
    		game.camera.follow(player);
    
    		game.add.sprite(0, 0, 'world-fore');
    
    		talkbox = game.add.sprite(120, 380, 'talkboximg');  
    		talkbox.alpha = 0; //
    		talkbox.talkText = talkbox.addChild(game.add.text(5, 5, '', { fontSize: '16px', fill: '#000' }));
    		talkbox.fixedToCamera = true;
    
    		var buttonMenu = game.add.button(2, 2, 'button-menu', null, this, 0, 1, 0, 1);
    		buttonMenu.fixedToCamera = true;
    		buttonMenu.events.onInputDown.add(function(){
    			this.saveData();
    			game.state.start('viewinfo');
    		},this);
    		if(!game.device.desktop){
    			this.addTouchKey();
    		}
    		cursors = game.input.keyboard.createCursorKeys();
    		actKey  = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    		actKey.onDown.add(this.actKeyDown, this);
    
    	};
    
    	this.update = function(){  
    		game.physics.arcade.collide(player, layer_1); 
    		game.physics.arcade.collide(npcs, layer_1); 
    		game.physics.arcade.collide(monsters, layer_1); 
    		game.physics.arcade.collide(player, npcs); 
    		game.physics.arcade.overlap(player, monsters,function(player, monster){
    			this.saveData();
    			fightingID = monster.idx;
    			game.state.start('fighting');
    		}, null, this); 
    
    		player.body.velocity.x = 0;
    		player.body.velocity.y = 0;
    		if(talking==0){
    			if(cursors.left.isDown || touchLeft){
    				player.body.velocity.x = -160;
    				facing=1;
    			}else if(cursors.right.isDown || touchRight){ 
    				player.body.velocity.x = 160;  
    				facing=2;
    			}else if (cursors.up.isDown || touchUp){ 
    				player.body.velocity.y = -160;
    				facing=3;
    			}else if(cursors.down.isDown || touchDown){
    				player.body.velocity.y = 160;
    				facing=0;
    			}
    		}
    		if(player.body.velocity.x==0 && player.body.velocity.y==0){
    			player.animations.stop();
    			player.frame = facing*12+1;
    		}else{
    			player.animations.play(directions[facing]);
    
    			if(playerData[7]==2){
    				game.state.start('gamewin');
    			}
    		}

    		npcs.forEachAlive(this.npcmove,this); 
    		monsters.forEachAlive(this.npcmove,this); 
    	};
    	this.npcmove = function(npc){
    		if(!npc.talking && game.time.now>npc.timetomove){
    			var go = parseInt(Math.random()*12);
    			npc.body.velocity.x = go==1 ? -30 : (go==2 ? 30 : 0);
    			npc.body.velocity.y = go==0 ? 30 : (go==3 ? -30 : 0);
    			npc.animations.play(directions[go%4]);
    			npc.timetomove = game.time.now + Math.random()*1000 + 500;
    		}
    	};
    	this.getHitNPC = function(x,y){
    		for(idx in npcs.children){
    			if (npcs.children[idx].body.hitTest(x,y)){
    				return npcs.children[idx];
    			}
    		}
    		return null;
    	};
    	this.actKeyDown = function(){
    		if (game.time.now<actTimer){return;}
    		actTimer = game.time.now + 500;
    		if (talking==1){
    			talkingto.talking = false;
    			talkingto.timetomove = game.time.now + Math.random()*1000 + 500;
    			talkingto = null;
    
    			talking = 2;
    			talkbox.alpha = 1;
    			game.add.tween(talkbox).to({alpha: 0 }, 100, "Linear", true).onComplete.add(function(){talking=0;},this);
    		}else if(talking==0){
    			var frontX = facing==1?-8:facing==2?40:16;
    			var frontY = facing==0?40:facing==3?-8:16;
    			talkingto = this.getHitNPC(player.x+frontX,player.y+frontY);
    			if(talkingto!=null){
    				talkingto.body.velocity.x = 0;
    				talkingto.body.velocity.y = 0;
    				talkingto.talking=true;
    				talkingto.animations.play(directions[facing==0?3:facing==1?2:facing==2?1:0]);
    
    				talking = 2;
    				talkbox.alpha = 0;
    				var talktext = npcData[talkingto.idx][4].split("|");

    				if(taskData[npcData[talkingto.idx][6]][0] == 9){ 
    					if(taskData[npcData[talkingto.idx][5]][0] != 9){ 
    						if(taskData[npcData[talkingto.idx][5]][0]==8){
    							taskData[npcData[talkingto.idx][5]][0] = 9;
    							playerData[7] = taskData[npcData[talkingto.idx][5]][7]; 
    							talkbox.talkText.text = npcData[talkingto.idx][0] + " : " + taskData[npcData[talkingto.idx][5]][6];
    						}else{
    							taskData[npcData[talkingto.idx][5]][0] = 1;
    							talkbox.talkText.text = npcData[talkingto.idx][0] + " : " + taskData[npcData[talkingto.idx][5]][5];
    						}
    					}else{
    						talkbox.talkText.text = npcData[talkingto.idx][0] + " : " + talktext[parseInt(Math.random()*talktext.length)];
    					}
    				}else{
    					talkbox.talkText.text = npcData[talkingto.idx][0] + " : " + talktext[parseInt(Math.random()*talktext.length)];
    				}
    				game.add.tween(talkbox).to({alpha: 1 }, 100, "Linear", true).onComplete.add(function(){talking=1;},this);
    			}
    		}
    	};
    	this.addTouchKey = function(){
    		var buttonfire = game.add.button(540, 380, 'button-a', null, this, 0, 1, 0, 1);
    		buttonfire.fixedToCamera = true;
    		buttonfire.events.onInputDown.add(this.actKeyDown,this);
    		var buttonleft = game.add.button(0, 384, 'button-arrow', null, this, 0, 1, 0, 1);
    		buttonleft.fixedToCamera = true;
    		buttonleft.events.onInputOver.add(function(){touchLeft=true;});
    		buttonleft.events.onInputDown.add(function(){touchLeft=true;});
    		buttonleft.events.onInputOut.add(function(){touchLeft=false;});
    		buttonleft.events.onInputUp.add(function(){touchLeft=false;});
    		var buttonright = game.add.button(196, 384, 'button-arrow', null, this, 0, 1, 0, 1);
    		buttonright.fixedToCamera = true;
    		buttonright.scale.setTo(-1,1);
    		buttonright.events.onInputOver.add(function(){touchRight=true;});
    		buttonright.events.onInputDown.add(function(){touchRight=true;});
    		buttonright.events.onInputOut.add(function(){touchRight=false;});
    		buttonright.events.onInputUp.add(function(){touchRight=false;});
    		var buttonup = game.add.button(130, 350, 'button-arrow', null, this, 0, 1, 0, 1);
    		buttonup.rotation = Math.PI*0.5;
    		buttonup.fixedToCamera = true;
    		buttonup.events.onInputOver.add(function(){touchUp=true;});
    		buttonup.events.onInputDown.add(function(){touchUp=true;});
    		buttonup.events.onInputOut.add(function(){touchUp=false;});
    		buttonup.events.onInputUp.add(function(){touchUp=false;});
    		var buttondown = game.add.button(66, 480, 'button-arrow', null, this, 0, 1, 0, 1);
    		buttondown.rotation = Math.PI*1.5;
    		buttondown.fixedToCamera = true;
    		buttondown.events.onInputOver.add(function(){touchDown=true;});
    		buttondown.events.onInputDown.add(function(){touchDown=true;});
    		buttondown.events.onInputOut.add(function(){touchDown=false;});
    		buttondown.events.onInputUp.add(function(){touchDown=false;});
    	};
    	this.saveData = function(){
    		for(idx in npcs.children){
    			npcData[npcs.children[idx].idx][2] = parseInt(npcs.children[idx].x/32);
    			npcData[npcs.children[idx].idx][3] = parseInt(npcs.children[idx].y/32);
    		}
    		for(idx in monsters.children){
    			monsterData[monsters.children[idx].idx][2] = parseInt(monsters.children[idx].x/32);
    			monsterData[monsters.children[idx].idx][3] = parseInt(monsters.children[idx].y/32);
    		}
    		playerData[1] = parseInt(player.x/32);
    		playerData[2] = parseInt(player.y/32);
    	};
    }
    function ViewInfo(game){
    	this.create = function() {
    		var boximg = game.make.bitmapData(game.width-4, game.height-4);
    		boximg.context.strokeStyle = "rgb(192,192,192)";
    		boximg.context.strokeRect(0,0,game.width-4, 140);
    		boximg.rect(0,0, game.width-4, 140, "rgba(100,150,250,0.5)");
    
    		var box = game.add.sprite(2, 2, boximg);
    		box.addChild(game.add.sprite(25, 30, 'sheet-hero', 1)).scale.setTo(2,2);
    		var ifont = {fontSize:'16px',fill:'#fff'};
    		box.addChild(game.add.text(120, 20, "Name : "+playerData[0],ifont));
    		box.addChild(game.add.text(120, 40, "Health : " + playerData[3] + " / " + playerData[5],ifont));
    		box.addChild(game.add.text(120, 60, "Magic : " + playerData[4] + " / " + playerData[6],ifont));
    		box.addChild(game.add.text(120, 80, "Weapon : " + weapons[playerData[7]][0],ifont));
    		box.addChild(game.add.text(120, 100, "Armor : " + armors[playerData[8]][0],ifont));
    
    		var buttonClose = game.add.button(574, 2, 'button-x', null, this, 0, 1, 0, 1);
    		buttonClose.events.onInputDown.add(function(){game.state.start('gamemain');});
    	}
    }
    function Fighting(game){
    	var player;
    	var monster;
    	var actFire;
    	var actFire2;
    
    	var waiting = false;
    	var myTurn = true;
    	var isOver = false;
    
    	var box;
    	var lifeText;
    	var tips;
    
    	this.preload = function() {
    		waiting = false;
    		myTurn = true;
    		isOver = false;
    	}
    	this.create = function() {
    
    		game.add.sprite(0, 0, 'fightingback');
    
    		var boximg = game.make.bitmapData(game.width-4, game.height-4);
    		boximg.context.strokeStyle = "rgb(192,192,192)";
    		boximg.context.strokeRect(0,0,game.width-4, 80);
    		boximg.rect(0,0, game.width-4, 80, "rgba(100,150,250,0.5)");
    
    		box = game.add.sprite(2, game.height-83, boximg);
    		box.addChild(game.add.sprite(25, 10, 'sheet-hero', 1));
    		var ifont = {fontSize:'16px',fill:'#fff'};
    		box.addChild(game.add.text(20, 50, playerData[0],ifont));
    		lifeText = game.add.text(120, 20, "Health : " + playerData[3] ,ifont);
    		box.addChild(lifeText);
    		box.addChild(game.add.text(120, 40, "Magic : " + playerData[4] ,ifont));
    		//monster
    		var img = (monsterData[fightingID][1]%4)*3+parseInt(monsterData[fightingID][1]/4)*48;
    		monster = game.add.sprite(300, 160, 'sheet-monster', img+1)
    		monster.anchor.setTo(0.5,0.5);
    		monster.scale.setTo(1.5,1.5);
    		monster.life = monsterData[fightingID][4];
    		monster.damage = monsterData[fightingID][5];
    		actFire = game.add.sprite(300, 170, 'fire', 6);
    		actFire.anchor.setTo(0.5,0.5);
    		actFire.animations.add('one-1', [0, 2, 4, 6, 9], 10, false);
    		actFire.animations.add('one-2', [1, 3, 5, 7, 9], 10, false);
    		actFire.animations.add('two', [0, 2, 4, 6, 1, 3, 5, 7, 9], 10, false);
    		//player
    		player = game.add.sprite(300, 300, 'sheet-hero', 36)
    		player.anchor.setTo(0.5,0.5);
    		player.scale.setTo(2,2);
    		player.life = playerData[3];
    		player.damage = weapons[playerData[7]][1];
    		actFire2 = game.add.sprite(300, 280, 'fire2', 3);
    		actFire2.anchor.setTo(0.5,0.5);
    		actFire2.animations.add('one-1', [0, 1, 2, 3, 7], 10, false);
    		actFire2.animations.add('one-2', [4, 5, 6, 3, 7], 10, false);
    		actFire2.animations.add('two', [0, 1, 2, 4, 5, 6, 7], 10, false);
    
    		tips = game.add.text(0, 0, "", ifont);
    		tips.anchor.setTo(0.5,0.5);
    		tips.alpha=0;
    
    		var buttonAtt = game.add.button(game.width-134, game.height-160, 'button-att', null, this, 0, 1, 0, 1);
    		buttonAtt.events.onInputDown.add(function(){
    			if(myTurn && !waiting){
    				waiting = true;
    				game.add.tween(player).to({y:220,width:56,height:56},200,"Linear",true).onComplete.add(function(){
    					actFire.animations.play('one-1');
    				},this);
    			}
    		});
    		var buttonClose = game.add.button(game.width-68, game.height-160, 'button-leave', null, this, 0, 1, 0, 1);
    		buttonClose.events.onInputDown.add(function(){
    			game.state.start('gamemain');
    		});
    
    	};
    	this.update = function(){
    		if(isOver){
    			if(monster.life<=0){ //win
    				monsterData[fightingID][4] = 0;
    				for (idx in taskData){
    					if(taskData[idx][1]==fightingID && taskData[idx][0]>0 && taskData[idx][0]!=9){
    						taskData[idx][3] ++;
    						taskData[idx][0] = taskData[idx][3] >= taskData[idx][2] ? 8 : taskData[idx][0]; 
    					}
    				}
    				game.state.start('gamemain');
    			}else{
    				game.state.start('gameover');
    			}

    		}else{
    			if(myTurn){
    				if(waiting && actFire.frame==9){
    					player.reset(300,300);
    					player.scale.setTo(2,2);
    					actFire.frame = 6;
    					actFire.animations.stop();
    
    					var killValue = player.damage + parseInt(Math.random() * player.damage);
    					monster.life -= killValue;
    					tips.reset(monster.x,monster.y-30);
    					tips.text = "-"+killValue;
    					tips.alpha = 1;
    					game.add.tween(tips).to({y:monster.y-60,alpha:0},500,"Linear",true).onComplete.add(function(){
    						waiting = false;
    						myTurn = false;
    						if(monster.life<=0){isOver=true;}
    					},this);
    				}
    			}else{
    				if(!waiting){
    					waiting = true;
    					game.add.tween(monster).to({y:220,width:56,height:56},200,"Linear",true).onComplete.add(function(){
    						actFire2.animations.play('one-1');
    					},this);
    				}else{
    					if(actFire2.frame==7){ 
    						monster.reset(300,160);
    						monster.scale.setTo(1.5,1.5);
    						actFire2.frame = 3;
    						actFire2.animations.stop();
    
    						var killValue = parseInt( monster.damage * (Math.random() + 1) / 2 );
    						tips.reset(player.x,player.y-30);
    						tips.text = "-" + killValue;
    						tips.alpha = 1;
    						game.add.tween(tips).to({y:player.y-60,alpha:0},500,"Linear",true).onComplete.add(function(){
    							waiting = false;
    							myTurn = true;
    						},this);
    						player.life -= killValue;
    						lifeText.text = "Health : " + player.life;
    						if(player.life<=0){ isOver = true; }
    
    					}
    				}
    			}
    		}
    	};
    }
