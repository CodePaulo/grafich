const nome = document.querySelector("#nome")
const enviar = document.querySelector("#pesquisar")
const recebendoDados = document.querySelector("#recebendo_dados")
const recebendoFoto = document.querySelector(".contem_imagem")

enviar.addEventListener("click", (e)=>{
	e.preventDefault()

	let valorNome = nome.value
	let valorNomeFormatado = valorNome.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
	let armazenandoDados = ""
	let armazenadofoto = ""

	for(let i = 0; i < biblioteca.length; i++){
		let nomeBcFormatado = biblioteca[i].NomeArtistico.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
		if(valorNomeFormatado == 0){
			armazenandoDados = ""
			armazenadofoto = ""
			recebendoDados.style.display = 'none'
			break
		}if(valorNomeFormatado == nomeBcFormatado){
			armazenandoDados = `<p>Nome: ${biblioteca[i].NomeDeBatismo}</p>
			<p>Data de Nascimento: ${biblioteca[i].DataDeNascimento}</p>
			<p>Profissão: ${biblioteca[i].Profissao}</p>`
			if(biblioteca[i].foto !== undefined){
				armazenadofoto = biblioteca[i].foto
			}
			break
			recebendoDados.style.display = 'block'
		}else{
			armazenandoDados = `<p>Artista não encontrado! verifique se foi digitado corretamente o nome do artista, ou tente digitar o nome artístico completo. Se ainda não aparecer, iremos incluí-lo em breve!</p>`
			armazenadofoto = ""
			recebendoDados.style.display = 'block'
		}
	}
	recebendoDados.innerHTML = armazenandoDados
	recebendoFoto.innerHTML = armazenadofoto



})