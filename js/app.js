const rotas = {
    home: { titulo: "Home", arquivo: "home.html" },
    sobre: { titulo: "Sobre Nós", arquivo: "sobre.html" }
};

function carregarComponentes(file, path) 
{
    fetch(path)
        .then(res => res.text())
        .then(htmlComponent => {
            document.getElementById(file).innerHTML = htmlComponent; //substitui o conteudo do elemento pelo HTML do componente
        })
        .catch(() => {
            document.getElementById(file).innerHTML = `<p style="color: red;">Erro ao carregar componente</p>`;
        });

}

function carregarComponentesInternos(container) 
{
    const componentes = container.querySelectorAll("[data-componente]"); //busca todos os elementos que possuem o atributo data-componente
    componentes.forEach(div => {
        const nome = div.dataset.componente;//pega o nome do componente
        const config = { ...div.dataset };
        delete config.componente;

        fetch(`componentes/${nome}.html`)//requisição HTTP para o arquivo HTML do componente pegando a constante como nome do componente
            .then(res => res.text())//pega o conteúdo do arquivo do componente em forma te texto
            .then(html => {
                Object.keys(config).forEach(chave => {
                    const valor = config[chave];
                    const marcador = new RegExp(`{{\\s*${chave}\\s*}}`, "g");
                    html = html.replace(marcador, valor);
                })

                div.outerHTML = html; //substitui o elemento atual pelo HTML do componente
            })
            .catch(() => {
                div.outerHTML = `<p style="color: red;">Erro ao carregar componente Interno</p>`;
            });
    });
}

function carregarPagina(hash) 
{
    const rota = hash.replace("#", "") || "home"; //pega o hash da URL e remove o #, se não houver hash, define como home

    if (!rotas[rota]) 
    {
        document.getElementById("conteudo").innerHTML = "<h2>ERRO 404</h2><p>Página não encontrada!</p>";
        document.title = "ERRO 404";
        return;
    }

    fetch(rotas[rota].arquivo) //requisição HTTP para o arquivo HTML
        .then(res => res.text()) //espera a requisicao e pega o conteúdo em forma de texto de res
        .then(html => {
            const conteudo = document.getElementById("conteudo");//busca no documento o elemento com id=conteudo
            conteudo.innerHTML = html; //substitui o conteúdo do elemento atual pelo HTML lido no fetch
            document.title = rotas[rota].titulo; //atualiza o título da página para o titulo do objeto.
            carregarComponentesInternos(conteudo); //carrega os componentes internos da página
        })
        .catch(() => {
            document.getElementById("conteudo").innerHTML = "<h2>ERRO 404</h2><p>Conteúdo não encontrado!</p>";
            document.title = "ERRO 404";
        });
}

window.addEventListener("DOMContentLoaded", () => {
    carregarComponentes("header", "componentes/header.html");
    carregarComponentes("footer", "componentes/footer.html");
    carregarPagina(location.hash); //carrega a página inicial
});
window.addEventListener("hashchange", () => carregarPagina(location.hash)); //quando houver uma mudança no hash da página roda a função