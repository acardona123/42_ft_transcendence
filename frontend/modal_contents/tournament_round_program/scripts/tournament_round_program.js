const tournament_modal_id = "modal-tournament-round-program"

let modal_tournament_round_program = new bootstrap.Modal(document.getElementById(tournament_modal_id), {backdrop : "static", keyboard : false});

async function open_modal_tournament_round_program(){
	await update_round_data(tournament_id);
	modal_tournament_round_program.show();
}