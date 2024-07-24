window.onload=function(){
	var config = {
		width: 800,
		height: 600,
		backgroundColor: 0xFF0000,
		scene: [SceneBoot, ScenePlay]
	}
	var game= new Phaser.Game(config);
}