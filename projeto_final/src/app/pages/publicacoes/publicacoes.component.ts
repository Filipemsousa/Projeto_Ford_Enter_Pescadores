import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { HeaderComponent } from "../../componentes/header/header.component";
import { FooterComponent } from "../../componentes/footer/footer.component";

interface Post {
  id: number;
  title?: string;
  text?: string;
  images?: string[];
  date: string;
}

@Component({
  selector: 'app-publicacoes',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './publicacoes.component.html',
  styleUrl: './publicacoes.component.css'
})
export class PublicacoesComponent implements OnInit, AfterViewInit {
  tempImages: string[] = [];
  postsArray: Post[] = [];

  @ViewChild('editorContainer') editorContainer!: ElementRef;
  @ViewChild('feedContainer') feedContainer!: ElementRef;
  @ViewChild('editorTitle') editorTitle!: ElementRef;
  @ViewChild('editorText') editorText!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('saveIndicator') saveIndicator!: ElementRef;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // Load data from localStorage
    const savedPosts: Post[] = JSON.parse(localStorage.getItem('feedPosts') || '[]');
    if (savedPosts.length > 0) {
      this.postsArray = savedPosts;
    }
  }

  ngAfterViewInit() {
    // Now ViewChild elements are available
    this.renderExistingPosts();
  }

  renderExistingPosts(): void {
    this.postsArray.forEach(post => this.renderPost(post));
  }

  // Mostrar/Ocultar editor
  showEditor(): void {
    this.renderer.setStyle(this.editorContainer.nativeElement, 'display', 'block');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  hideEditor(): void {
    this.renderer.setStyle(this.editorContainer.nativeElement, 'display', 'none');
  }

  // Salvar dados no localStorage
  saveData(): void {
    localStorage.setItem('feedPosts', JSON.stringify(this.postsArray));
    this.renderer.setStyle(this.saveIndicator.nativeElement, 'display', 'block');
    setTimeout(() => {
      if (this.saveIndicator) {
        this.renderer.setStyle(this.saveIndicator.nativeElement, 'display', 'none');
      }
    }, 800);
  }

  // Carregar feed
  loadData(): void {
    const savedPosts: Post[] = JSON.parse(localStorage.getItem('feedPosts') || '[]');
    if (savedPosts.length > 0) {
      this.postsArray = savedPosts;
      savedPosts.forEach(post => this.renderPost(post));
    }
  }

  // Renderizar post
  renderPost(post: Post): void {
    const feedContainer = this.feedContainer.nativeElement;
    const feedItem = this.renderer.createElement('div');
    this.renderer.addClass(feedItem, 'feed-item');
    this.renderer.setAttribute(feedItem, 'data-id', post.id.toString());

    // Botão X vermelho para deletar
    const deleteBtn = this.renderer.createElement('button');
    this.renderer.addClass(deleteBtn, 'delete-btn');
    this.renderer.setProperty(deleteBtn, 'textContent', 'X');
    this.renderer.listen(deleteBtn, 'click', () => this.deletePost(post.id));
    this.renderer.appendChild(feedItem, deleteBtn);

    // Título
    if (post.title) {
      const h3 = this.renderer.createElement('h3');
      this.renderer.setProperty(h3, 'textContent', post.title);
      this.renderer.appendChild(feedItem, h3);
    }

    // Imagens
    if (post.images && post.images.length > 0) {
      post.images.forEach(imageUrl => {
        const img = this.renderer.createElement('img');
        this.renderer.setAttribute(img, 'src', imageUrl);
        this.renderer.appendChild(feedItem, img);
      });
    }

    // Texto
    if (post.text) {
      const p = this.renderer.createElement('p');
      this.renderer.setProperty(p, 'textContent', post.text);
      this.renderer.appendChild(feedItem, p);
    }

    this.renderer.insertBefore(feedContainer, feedItem, feedContainer.firstChild);
  }

  // Upload de imagens
  handleImageUpload(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    this.tempImages = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: Event) => {
          const result = (e.target as FileReader).result as string;
          this.tempImages.push(result);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  // Publicar
  publishPost(): void {
    const title = this.editorTitle.nativeElement.value.trim();
    const text = this.editorText.nativeElement.value.trim();

    if (!title && !text && this.tempImages.length === 0) {
      alert('Adicione pelo menos um título, texto ou imagem antes de publicar!');
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      title,
      text,
      images: [...this.tempImages],
      date: new Date().toISOString()
    };

    this.postsArray.push(newPost);
    this.renderPost(newPost);
    this.saveData();

    // Limpar e ocultar
    this.editorTitle.nativeElement.value = '';
    this.editorText.nativeElement.value = '';
    this.imageInput.nativeElement.value = '';
    this.tempImages = [];

    this.hideEditor();
  }

  // Deletar publicação
  deletePost(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta publicação?')) {
      this.postsArray = this.postsArray.filter(post => post.id !== id);
      this.saveData();
      const item = this.feedContainer.nativeElement.querySelector(`.feed-item[data-id='${id}']`);
      if (item) {
        this.renderer.removeChild(this.feedContainer.nativeElement, item);
      }
    }
  }
}
