$(document).ready(function(){
	$('.delete-genre').on('click', function(){
		var id = $(this).data('id');
		var url = '/genres/delete/' +id;

		if(confirm('Do you want to delete this Genre?')){
			$.ajax({
				url: url,
				type: 'DELETE',
				success: function(result){
					console.log('Deleting genre');
					window.location.href='/genres';
				},

				error: function(err){
					console.log(err);
				}
			});
		}
	});

	$('.delete-album').on('click', function(){
		var id = $(this).data('id');
		var url = '/albums/delete/' +id;

		if(confirm('Do you want to delete this album?')){
			$.ajax({
				url: url,
				type: 'DELETE',
				success: function(result){
					console.log('Deleting album');
					window.location.href='/albums';
				},

				error: function(err){
					console.log(err);
				}
			});
		}		
	});
});