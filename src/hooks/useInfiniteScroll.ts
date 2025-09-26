import { useEffect, useCallback, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  /**
   * Função chamada quando o usuário está próximo do final da página
   */
  onLoadMore: () => void;
  
  /**
   * Se há mais conteúdo para carregar
   */
  hasMore: boolean;
  
  /**
   * Se está carregando atualmente
   */
  isLoading: boolean;
  
  /**
   * Distância em pixels do final da página para disparar o carregamento
   * @default 200
   */
  threshold?: number;
  
  /**
   * Elemento raiz para observar o scroll (se não fornecido, usa window)
   */
  rootElement?: HTMLElement | null;
}

/**
 * Hook personalizado para implementar scroll infinito
 * 
 * Como a Força que conecta todas as coisas no universo Star Wars,
 * este hook conecta o scroll do usuário com o carregamento de dados! ⚡
 */
export const useInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
  rootElement = null
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  // Função para verificar se deve carregar mais conteúdo
  const checkScrollPosition = useCallback(() => {
    if (!hasMore || isLoading) return;

    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;

    if (rootElement) {
      scrollTop = rootElement.scrollTop;
      scrollHeight = rootElement.scrollHeight;
      clientHeight = rootElement.clientHeight;
    } else {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      scrollHeight = document.documentElement.scrollHeight;
      clientHeight = window.innerHeight;
    }

    // Verifica se está próximo do final (dentro do threshold)
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    if (isNearBottom) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore, threshold, rootElement]);

  // Configurar Intersection Observer para melhor performance
  const setupIntersectionObserver = useCallback(() => {
    if (!sentinelRef.current) return;

    // Limpar observer anterior se existir
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        // Se o sentinel está visível e podemos carregar mais
        if (entry.isIntersecting && hasMore && !isLoading) {
          // Ativa estado de preparação para feedback imediato
          setIsPreparing(true);
          
          // Pequeno delay para mostrar o estado de preparação
          setTimeout(() => {
            setIsPreparing(false);
            onLoadMore();
          }, 150);
        }
      },
      {
        root: rootElement,
        rootMargin: `${threshold}px`,
        threshold: 0.1
      }
    );

    observerRef.current.observe(sentinelRef.current);
  }, [hasMore, isLoading, onLoadMore, threshold, rootElement]);

  // Configurar listeners de scroll como fallback
  useEffect(() => {
    const element = rootElement || window;
    
    // Usar Intersection Observer se disponível, senão fallback para scroll
    if ('IntersectionObserver' in window) {
      setupIntersectionObserver();
    } else {
      element.addEventListener('scroll', checkScrollPosition, { passive: true });
      element.addEventListener('resize', checkScrollPosition, { passive: true });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      
      element.removeEventListener('scroll', checkScrollPosition);
      element.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition, setupIntersectionObserver, rootElement]);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    /**
     * Ref para o elemento sentinel que deve ser colocado no final da lista
     * Este elemento invisível dispara o carregamento quando entra na viewport
     */
    sentinelRef,
    
    /**
     * Estado que indica se está se preparando para carregar mais conteúdo
     * Útil para mostrar feedback imediato ao usuário
     */
    isPreparing
  };
};

export default useInfiniteScroll;