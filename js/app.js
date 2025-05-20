const rotas = {
    home: { titulo: "Home", arquivo: "home.html" },
    sobre: { titulo: "Sobre Nós", arquivo: "sobre.html" }
};

function carregarComponentes(id, caminho) 
{
    fetch(caminho)
        .then(resp => resp.text())
        .then(html => {
            document.getElementById(id).innerHTML = html;
        })
        .catch(() => {
            document.getElementById(id).innerHTML = "<p>Erro ao carregar componente</p>";
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

    fetch(rotas[rota].arquivo)
        .then(response => {
            if (!response.ok) throw new Error("Página não encontrada");
            return response.text();
        })
        .then(html => {
            document.getElementById("conteudo").innerHTML = html;
            document.title = rotas[rota].titulo;
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
//window.addEventListener("DOMContentLoaded", () => carregarPagina(location.hash));