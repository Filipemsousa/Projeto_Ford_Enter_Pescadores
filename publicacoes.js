let tempImages = [];
    let postsArray = [];

    // Mostrar/Ocultar editor
    const editorContainer = document.getElementById("editor-container");
    const addPostBtn = document.getElementById("add-post-btn");
    const closeEditorBtn = document.getElementById("close-editor");

    addPostBtn.addEventListener("click", () => {
        editorContainer.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    closeEditorBtn.addEventListener("click", () => {
        editorContainer.style.display = "none";
    });

    // Salvar dados no localStorage
    function saveData() {
        localStorage.setItem('feedPosts', JSON.stringify(postsArray));
        const indicator = document.getElementById("save-indicator");
        indicator.style.display = 'block';
        setTimeout(() => indicator.style.display = 'none', 800);
    }

    // Carregar feed
    function loadData() {
        const savedPosts = JSON.parse(localStorage.getItem('feedPosts'));
        if (savedPosts && savedPosts.length > 0) {
            postsArray = savedPosts;
            savedPosts.forEach(post => renderPost(post));
        }
    }

    // Renderizar post
    function renderPost(post) {
        const feedItem = document.createElement('div');
        feedItem.classList.add('feed-item');
        feedItem.dataset.id = post.id;

        // Botão X vermelho para deletar
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = "X";
        deleteBtn.addEventListener("click", () => deletePost(post.id));
        feedItem.appendChild(deleteBtn);

        // Título
        if (post.title) {
            const h3 = document.createElement('h3');
            h3.textContent = post.title;
            feedItem.appendChild(h3);
        }

        // Imagens
        if (post.images && post.images.length > 0) {
            post.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                feedItem.appendChild(img);
            });
        }

        // Texto
        if (post.text) {
            const p = document.createElement('p');
            p.textContent = post.text;
            feedItem.appendChild(p);
        }

        document.getElementById("feed-container").prepend(feedItem);
    }

    // Upload de imagens
    function handleImageUpload(event) {
        const files = event.target.files;
        tempImages = [];

        for (let i = 0; i < files.length; i++) {
            const reader = new FileReader();
            reader.onload = function(e) {
                tempImages.push(e.target.result);
            };
            reader.readAsDataURL(files[i]);
        }
    }

    // Publicar
    function publishPost() {
        const title = document.getElementById("editor-title").value.trim();
        const text = document.getElementById("editor-text").value.trim();

        if (!title && !text && tempImages.length === 0) {
            alert("Adicione pelo menos um título, texto ou imagem antes de publicar!");
            return;
        }

        const newPost = {
            id: Date.now(), // 🔹 ID único necessário
            title,
            text,
            images: [...tempImages],
            date: new Date().toISOString()
        };

        postsArray.push(newPost);
        renderPost(newPost);
        saveData();

        // Limpar e ocultar
        document.getElementById("editor-title").value = '';
        document.getElementById("editor-text").value = '';
        document.getElementById("image-input").value = '';
        tempImages = [];

        editorContainer.style.display = "none";
    }

    // Deletar publicação
    function deletePost(id) {
        if (confirm("Tem certeza que deseja excluir esta publicação?")) {
            postsArray = postsArray.filter(post => post.id !== id);
            saveData();
            const item = document.querySelector(`.feed-item[data-id='${id}']`);
            if (item) item.remove();
        }
    }

    window.onload = function() {
        loadData();
        document.getElementById("image-input").addEventListener('change', handleImageUpload);
        document.getElementById("publish-btn").addEventListener('click', publishPost);
    };