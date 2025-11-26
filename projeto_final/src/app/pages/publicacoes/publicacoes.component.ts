import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface Post {
  id: number;
  title?: string;
  text?: string;
  images?: string[];
  videos?: string[];
  date: string;
}

@Component({
  selector: 'app-publicacoes',
  imports: [CommonModule],
  templateUrl: './publicacoes.component.html',
  styleUrl: './publicacoes.component.css'
})
export class PublicacoesComponent implements OnInit, AfterViewInit {
  tempImages: string[] = [];
  tempVideos: string[] = [];
  postsArray: Post[] = [];

  @ViewChild('editorContainer') editorContainer!: ElementRef;
  @ViewChild('feedContainer') feedContainer!: ElementRef;
  @ViewChild('editorTitle') editorTitle!: ElementRef;
  @ViewChild('editorText') editorText!: ElementRef;
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('saveIndicator') saveIndicator!: ElementRef;

  constructor(private renderer: Renderer2, private auth: AuthService) { }

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
      if (post.images.length === 1) {
        // Single image
        const img = this.renderer.createElement('img');
        this.renderer.setAttribute(img, 'src', post.images[0]);
        this.renderer.appendChild(feedItem, img);
      } else {
        // Carousel for multiple images
        this.renderCarousel(feedItem, post.images, post.id);
      }
    }

    // Vídeos
    if (post.videos && post.videos.length > 0) {
      post.videos.forEach(videoUrl => {
        const iframe = this.renderer.createElement('iframe');
        this.renderer.setAttribute(iframe, 'src', videoUrl);
        this.renderer.setAttribute(iframe, 'width', '560');
        this.renderer.setAttribute(iframe, 'height', '315');
        this.renderer.setAttribute(iframe, 'frameborder', '0');
        this.renderer.setAttribute(iframe, 'allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        this.renderer.setAttribute(iframe, 'allowfullscreen', 'true');
        this.renderer.appendChild(feedItem, iframe);
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

  // Extrair ID do vídeo do YouTube
  extractYouTubeVideoId(url: string): string | null {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^"&?\/\s]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^"&?\/\s]{11})/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  }

  // Adicionar vídeo do YouTube
  addYouTubeVideo(url: string): void {
    const videoId = this.extractYouTubeVideoId(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      if (this.tempVideos.length === 0) {
        this.tempVideos.push(embedUrl);
      } else {
        alert('Cada publicação pode conter apenas um vídeo!');
      }
    } else {
      alert('URL do YouTube inválida!');
    }
  }

  // Remover vídeo temporário
  removeTempVideo(index: number): void {
    this.tempVideos.splice(index, 1);
  }

  // Publicar
  publishPost(): void {
    if (!this.auth.isLoggedIn) {
      alert('Somente o ADM tem permissão para realizar esta ação!');
      return;
    }

    const title = this.editorTitle.nativeElement.value.trim();
    const text = this.editorText.nativeElement.value.trim();

    if (!title && !text && this.tempImages.length === 0 && this.tempVideos.length === 0) {
      alert('Adicione pelo menos um título, texto, imagem ou vídeo do YouTube antes de publicar!');
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      title,
      text,
      images: [...this.tempImages],
      videos: [...this.tempVideos],
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
    this.tempVideos = [];

    this.hideEditor();
  }

  // Renderizar carousel para múltiplas imagens
  renderCarousel(feedItem: Element, images: string[], postId: number): void {
    const carouselContainer = this.renderer.createElement('div');
    this.renderer.addClass(carouselContainer, 'carousel');

    // Slides container
    const slidesContainer = this.renderer.createElement('div');
    this.renderer.addClass(slidesContainer, 'carousel-slides');

    // Create slides
    images.forEach((imageUrl, index) => {
      const slide = this.renderer.createElement('div');
      this.renderer.addClass(slide, 'carousel-slide');
      if (index === 0) {
        this.renderer.addClass(slide, 'active');
      }

      const img = this.renderer.createElement('img');
      this.renderer.setAttribute(img, 'src', imageUrl);
      this.renderer.setAttribute(img, 'alt', `Imagem ${index + 1} da publicação ${postId}`);

      this.renderer.appendChild(slide, img);
      this.renderer.appendChild(slidesContainer, slide);
    });

    // Navigation buttons
    const prevBtn = this.renderer.createElement('button');
    this.renderer.addClass(prevBtn, 'carousel-btn');
    this.renderer.addClass(prevBtn, 'carousel-prev');
    this.renderer.setProperty(prevBtn, 'textContent', '‹');
    this.renderer.listen(prevBtn, 'click', () => this.moveCarousel(carouselContainer, -1));

    const nextBtn = this.renderer.createElement('button');
    this.renderer.addClass(nextBtn, 'carousel-btn');
    this.renderer.addClass(nextBtn, 'carousel-next');
    this.renderer.setProperty(nextBtn, 'textContent', '›');
    this.renderer.listen(nextBtn, 'click', () => this.moveCarousel(carouselContainer, 1));

    // Indicators
    const indicatorsContainer = this.renderer.createElement('div');
    this.renderer.addClass(indicatorsContainer, 'carousel-indicators');

    images.forEach((_, index) => {
      const indicator = this.renderer.createElement('span');
      this.renderer.addClass(indicator, 'carousel-indicator');
      if (index === 0) {
        this.renderer.addClass(indicator, 'active');
      }
      this.renderer.listen(indicator, 'click', () => this.goToSlide(carouselContainer, index));
      this.renderer.appendChild(indicatorsContainer, indicator);
    });

    // Assemble carousel
    this.renderer.appendChild(carouselContainer, slidesContainer);
    this.renderer.appendChild(carouselContainer, prevBtn);
    this.renderer.appendChild(carouselContainer, nextBtn);
    this.renderer.appendChild(carouselContainer, indicatorsContainer);

    this.renderer.appendChild(feedItem, carouselContainer);
  }

  // Mover carousel
  moveCarousel(carousel: Element, direction: number): void {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.carousel-indicator');
    const totalSlides = slides.length;

    if (totalSlides <= 1) return;

    let currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0;

    // Update current slide
    slides[currentIndex].classList.remove('active');
    indicators[currentIndex].classList.remove('active');

    // Calculate new index
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;

    // Update new slide
    slides[currentIndex].classList.add('active');
    indicators[currentIndex].classList.add('active');
  }

  // Ir para slide específico
  goToSlide(carousel: Element, slideIndex: number): void {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const indicators = carousel.querySelectorAll('.carousel-indicator');

    // Remove active class from all
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to target
    slides[slideIndex].classList.add('active');
    indicators[slideIndex].classList.add('active');
  }

  // Deletar publicação
  deletePost(id: number): void {
    if (!this.auth.isLoggedIn) {
      alert('Somente o ADM tem permissão para realizar esta ação!');
      return;
    }

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
