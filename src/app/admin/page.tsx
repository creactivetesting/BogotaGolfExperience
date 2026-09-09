'use client';

import { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import bgxLogo from '@/assets/optimized/bgx-logo.webp';

const MAX_BLOG_COVER_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;

function normalizeAffiliateCode(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 40);
}

type Ambassador = {
  id: string;
  name: string;
  email: string;
  code: string;
  commissionRate: number;
  status: string;
  createdAt: string;
};

type Plan = {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  createdAt: string;
};

type GolfCourse = {
  id: string;
  name: string;
  isAvailable: boolean;
  homeFeatured: boolean;
  createdAt: string;
};

type QuotePackageTemplate = {
  subtitle: string;
  duration: string;
  includes: string[];
};

type QuoteStatus = 'PENDING' | 'BOUGHT' | 'NOT_BOUGHT';

type GeneratedQuote = {
  id: string;
  customerName: string;
  planName: string;
  packageSubtitle: string | null;
  packageDuration: string | null;
  hotelName: string | null;
  playerCount: number;
  ambassadorName: string | null;
  ambassadorCode: string | null;
  subtotal: number;
  commission: number;
  netMargin: number;
  selectedCoursesJson: string;
  includedItemsJson: string;
  status: QuoteStatus;
  createdAt: string;
};

type CustomerLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  city: string | null;
  state: string | null;
  intent: string;
  selectedPlan: string | null;
  playerCount: number | null;
  estimatedTotal: number | null;
  ambassadorName: string | null;
  ambassadorCode: string | null;
  source: string | null;
  consentMarketing: boolean;
  consentPrivacy: boolean;
  createdAt: string;
  updatedAt: string;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type LegalPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const QUOTE_PACKAGE_TEMPLATES: Record<string, QuotePackageTemplate> = {
  'bgx smart pack': {
    subtitle: '3 Golf Rounds',
    duration: '4 Days / 3 Nights',
    includes: [
      '3 Golf Rounds',
      'Daily breakfast included',
      'Private transportation throughout your stay',
      'Professional caddies-coaches at every round',
      'Dedicated golf-loving host accompanying your group throughout the journey',
      'Premium golf-ready welcome gift',
      'Curated Bogota nightlife and gastronomy concierge support',
    ],
  },
  'bgx elite pack': {
    subtitle: '4 Golf Rounds',
    duration: '5 Days / 4 Nights',
    includes: [
      '4 Golf Rounds',
      'Daily breakfast included',
      'Private transportation throughout your stay',
      'Professional caddies-coaches at every round',
      'Dedicated golf-loving host accompanying your group throughout the journey',
      'Premium golf-ready welcome gift',
      'Curated Bogota nightlife and gastronomy concierge support',
    ],
  },
};

const HOTEL_OPTIONS = ['Sonesta 127', 'Sabana Park'];

function getQuotePackageTemplate(planName?: string) {
  if (!planName) {
    return null;
  }

  return QUOTE_PACKAGE_TEMPLATES[planName.trim().toLowerCase()] ?? null;
}

function formatCurrencyUSD(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

function normalizePdfText(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[^\x20-\x7E]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function normalizeMatchValue(value?: string | null) {
  return (value ?? '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase();
}

function quoteStatusLabel(status: QuoteStatus) {
  if (status === 'BOUGHT') {
    return 'Cerrado - Comprado';
  }

  if (status === 'NOT_BOUGHT') {
    return 'Cerrado - No comprado';
  }

  return 'Abierto';
}

function isAmbassadorActive(status: string) {
  const normalized = status.trim().toLowerCase();
  return normalized === 'active' || normalized === 'activo';
}

function resolvePublicSiteOrigin() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    try {
      return new URL(configuredUrl).origin;
    } catch {
      console.error('NEXT_PUBLIC_SITE_URL no es una URL válida:', configuredUrl);
    }
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://localhost:3000';
}

async function loadImageDataUrl(src: string) {
  return await new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('No se pudo preparar el logo para el PDF.'));
        return;
      }

      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => reject(new Error('No se pudo cargar el logo para el PDF.'));
    image.src = src;
  });
}

export default function AdminPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [courses, setCourses] = useState<GolfCourse[]>([]);
  const [generatedQuotes, setGeneratedQuotes] = useState<GeneratedQuote[]>([]);
  const [customerLeads, setCustomerLeads] = useState<CustomerLead[]>([]);
  const [leadSearch, setLeadSearch] = useState('');
  const [leadFilterSource, setLeadFilterSource] = useState('all');
  const [leadFilterAmbassador, setLeadFilterAmbassador] = useState('all');
  const [isClearingLeads, setIsClearingLeads] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [legalPageSlug, setLegalPageSlug] = useState<'privacy-policy' | 'terms-of-service' | 'cookie-policy'>('privacy-policy');
  const [legalPageTitle, setLegalPageTitle] = useState('Privacy Policy');
  const [legalPageContent, setLegalPageContent] = useState('');
  const [isSavingLegalPage, setIsSavingLegalPage] = useState(false);
  const [activeTab, setActiveTab] = useState<'ambassadors' | 'plans' | 'quote' | 'courses' | 'generatedQuotes' | 'leads' | 'blogs' | 'terms'>('ambassadors');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [commissionRateInput, setCommissionRateInput] = useState('10');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commissionDrafts, setCommissionDrafts] = useState<Record<string, string>>({});
  const [priceDrafts, setPriceDrafts] = useState<Record<string, number>>({});
  const [isSavingPlan, setIsSavingPlan] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [playerCount, setPlayerCount] = useState('4');
  const [selectedHotelName, setSelectedHotelName] = useState('Sonesta 127');
  const [selectedAmbassadorId, setSelectedAmbassadorId] = useState('');
  const [selectedQuoteCourseIds, setSelectedQuoteCourseIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeletingAmbassadorId, setIsDeletingAmbassadorId] = useState<string | null>(null);
  const [isUpdatingAmbassadorCommissionId, setIsUpdatingAmbassadorCommissionId] = useState<string | null>(null);
  const [isUpdatingCourseId, setIsUpdatingCourseId] = useState<string | null>(null);
  const [isUpdatingHomeFeaturedCourseId, setIsUpdatingHomeFeaturedCourseId] = useState<string | null>(null);
  const [isGeneratingQuotePdf, setIsGeneratingQuotePdf] = useState(false);
  const [isUpdatingQuoteStatusId, setIsUpdatingQuoteStatusId] = useState<string | null>(null);
  const [generalAmbassadorStats, setGeneralAmbassadorStats] = useState<Array<{ ambassadorId: string; ambassadorName: string; ambassadorCode: string; totalClicks: number; topUrl: string | null; lastClickedAt: string | null }>>([]);
  const [isLoadingGeneralAmbassadorStats, setIsLoadingGeneralAmbassadorStats] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogSlug, setBlogSlug] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCoverImage, setBlogCoverImage] = useState('');
  const [blogCoverImageFileName, setBlogCoverImageFileName] = useState('');
  const [isDraggingBlogCoverImage, setIsDraggingBlogCoverImage] = useState(false);
  const [isProcessingBlogCoverImage, setIsProcessingBlogCoverImage] = useState(false);
  const [blogPublished, setBlogPublished] = useState(true);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [isSavingBlog, setIsSavingBlog] = useState(false);
  const [isDeletingBlogId, setIsDeletingBlogId] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const blogCoverInputRef = useRef<HTMLInputElement | null>(null);
  const publicSiteOrigin = resolvePublicSiteOrigin();

  function normalizeSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function loadAmbassadors() {
    const response = await fetch('/api/admin/ambassadors');
    const data = await response.json();
    setAmbassadors(data);
    const draftMap = Object.fromEntries((data as Ambassador[]).map((ambassador) => [ambassador.id, String(ambassador.commissionRate)]));
    setCommissionDrafts(draftMap);
  }

  async function loadPlans() {
    const response = await fetch('/api/admin/plans');
    const data = await response.json();
    setPlans(data);
    const draftMap = Object.fromEntries(data.map((plan: Plan) => [plan.id, plan.basePrice]));
    setPriceDrafts(draftMap);
    if (data.length > 0 && !selectedPlanId) {
      setSelectedPlanId(data[0].id);
    }
  }

  async function loadCourses() {
    const response = await fetch('/api/admin/courses');
    const data = await response.json();
    setCourses(data);
    setSelectedQuoteCourseIds((current) => (current.length > 0 ? current : data.map((course: GolfCourse) => course.id)));
  }

  async function loadGeneratedQuotes() {
    const response = await fetch('/api/admin/quotes');
    const data = await response.json();
    setGeneratedQuotes(data);
  }

  async function loadCustomerLeads() {
    const response = await fetch('/api/admin/leads', { cache: 'no-store' });
    const data = await response.json();
    setCustomerLeads(Array.isArray(data) ? data : []);
  }

  async function handleClearTestLeads() {
    const confirmed = window.confirm('This will permanently delete all current potential-client test records. Continue?');
    if (!confirmed) {
      return;
    }

    setIsClearingLeads(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.error || 'Unable to clear test leads.');
      }

      setCustomerLeads([]);
      setMessage(data?.message || 'All potential-client test data was cleared successfully.');
    } catch (error) {
      console.error('Error clearing leads:', error);
      setMessage(error instanceof Error ? error.message : 'Unable to clear test leads.');
    } finally {
      setIsClearingLeads(false);
    }
  }

  async function loadBlogs() {
    const response = await fetch('/api/admin/blogs');
    const data = await response.json();
    setBlogs(Array.isArray(data) ? data : []);
  }

  async function loadLegalPages() {
    const response = await fetch('/api/admin/legal');
    const data = await response.json();
    const pages = Array.isArray(data) ? data : [];
    setLegalPages(pages);

    if (pages.length > 0) {
      const selected = pages.find((page) => page.slug === legalPageSlug) ?? pages[0];
      setLegalPageTitle(selected.title);
      setLegalPageContent(selected.content);
    }
  }

  useEffect(() => {
    void loadAmbassadors();
    void loadPlans();
    void loadCourses();
    void loadGeneratedQuotes();
    void loadCustomerLeads();
    void loadBlogs();
    void loadLegalPages();
  }, []);

  useEffect(() => {
    if (activeTab === 'leads') {
      void loadCustomerLeads();
    }
  }, [activeTab]);

  useEffect(() => {
    const selected = legalPages.find((page) => page.slug === legalPageSlug);
    if (selected) {
      setLegalPageTitle(selected.title);
      setLegalPageContent(selected.content);
    }
  }, [legalPageSlug, legalPages]);

  useEffect(() => {
    let isMounted = true;

    async function loadGeneralAmbassadorStats() {
      setIsLoadingGeneralAmbassadorStats(true);

      try {
        const response = await fetch('/api/admin/ambassador-stats', { cache: 'no-store' });
        const data = await response.json().catch(() => ({ stats: [] }));

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo cargar el ranking general de clics.');
        }

        if (isMounted) {
          setGeneralAmbassadorStats(Array.isArray(data.stats) ? data.stats : []);
        }
      } catch (error) {
        console.error('Error cargando stats generales de URLs:', error);
        if (isMounted) {
          setGeneralAmbassadorStats([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingGeneralAmbassadorStats(false);
        }
      }
    }

    void loadGeneralAmbassadorStats();

    return () => {
      isMounted = false;
    };
  }, [ambassadors.length]);

  function resetBlogForm() {
    setEditingBlogId(null);
    setBlogTitle('');
    setBlogSlug('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogCoverImage('');
    setBlogCoverImageFileName('');
    setBlogPublished(true);
  }

  function startEditingBlog(blog: BlogPost) {
    setEditingBlogId(blog.id);
    setBlogTitle(blog.title);
    setBlogSlug(blog.slug);
    setBlogExcerpt(blog.excerpt);
    setBlogContent(blog.content);
    setBlogCoverImage(blog.coverImage ?? '');
    setBlogCoverImageFileName('');
    setBlogPublished(blog.isPublished);
  }

  async function convertFileToDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== 'string') {
          reject(new Error('Could not read image file.'));
          return;
        }
        resolve(result);
      };
      reader.onerror = () => reject(new Error('Could not process the selected image.'));
      reader.readAsDataURL(file);
    });
  }

  async function handleBlogCoverImageFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload a valid image file (JPG, PNG, WEBP, etc.).');
      return;
    }

    if (file.size > MAX_BLOG_COVER_IMAGE_SIZE_BYTES) {
      setMessage('Image is too large. Please use a file up to 2 MB.');
      return;
    }

    setIsProcessingBlogCoverImage(true);
    setMessage('');

    try {
      const dataUrl = await convertFileToDataUrl(file);
      setBlogCoverImage(dataUrl);
      setBlogCoverImageFileName(file.name);
    } catch (error) {
      console.error('Error processing blog cover image:', error);
      setMessage(error instanceof Error ? error.message : 'Could not process the selected image.');
    } finally {
      setIsProcessingBlogCoverImage(false);
    }
  }

  async function handleBlogCoverImageInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    await handleBlogCoverImageFile(file);
    event.target.value = '';
  }

  async function handleBlogCoverImageDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingBlogCoverImage(false);

    const file = event.dataTransfer.files?.[0];
    if (!file) {
      return;
    }

    await handleBlogCoverImageFile(file);
  }

  function clearBlogCoverImage() {
    setBlogCoverImage('');
    setBlogCoverImageFileName('');
  }

  async function handleSaveBlog(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingBlog(true);
    setMessage('');

    const title = blogTitle.trim();
    const slug = normalizeSlug(blogSlug || blogTitle);
    const excerpt = blogExcerpt.trim();
    const content = blogContent.trim();
    const coverImage = blogCoverImage.trim();

    if (!title || !slug || !excerpt || !content) {
      setMessage('Title, slug, excerpt, and content are required for the blog post.');
      setIsSavingBlog(false);
      return;
    }

    try {
      const payload = {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        isPublished: blogPublished,
      };

      const response = editingBlogId
        ? await fetch(`/api/admin/blogs/${editingBlogId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Could not save the blog post.');
      }

      await loadBlogs();
      resetBlogForm();
      setMessage(editingBlogId ? 'Blog post updated successfully.' : 'Blog post created successfully.');
    } catch (error) {
      console.error('Error guardando blog:', error);
      setMessage(error instanceof Error ? error.message : 'Could not save the blog post.');
    } finally {
      setIsSavingBlog(false);
    }
  }

  async function handleDeleteBlog(blogId: string) {
    const selectedBlog = blogs.find((blog) => blog.id === blogId);
    if (!selectedBlog) {
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete the blog post "${selectedBlog.title}"?`);
    if (!confirmed) {
      return;
    }

    setIsDeletingBlogId(blogId);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/blogs/${blogId}`, { method: 'DELETE' });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Could not delete the blog post.');
      }

      setBlogs((current) => current.filter((blog) => blog.id !== blogId));
      if (editingBlogId === blogId) {
        resetBlogForm();
      }
      setMessage('Blog post deleted successfully.');
    } catch (error) {
      console.error('Error eliminando blog:', error);
      setMessage(error instanceof Error ? error.message : 'Could not delete the blog post.');
    } finally {
      setIsDeletingBlogId(null);
    }
  }

  async function handleSaveLegalPage() {
    setIsSavingLegalPage(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/legal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: legalPageSlug,
          title: legalPageTitle.trim(),
          content: legalPageContent.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar la página legal.');
      }

      await loadLegalPages();
      setMessage(`${legalPageTitle} guardada correctamente.`);
    } catch (error) {
      console.error('Error guardando página legal:', error);
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la página legal.');
    } finally {
      setIsSavingLegalPage(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    setMessage('');

    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      window.location.assign('/admin/login');
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const normalizedCode = normalizeAffiliateCode(code);
    const parsedCommissionRate = Number(commissionRateInput);

    if (Number.isNaN(parsedCommissionRate) || parsedCommissionRate < 0 || parsedCommissionRate > 100) {
      setMessage('La comisión debe estar entre 0 y 100.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/ambassadors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, code: normalizedCode, commissionRate: parsedCommissionRate }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo guardar el embajador.');
      }

      setAmbassadors((current) => [data, ...current]);
      setName('');
      setEmail('');
      setCode('');
      setCommissionRateInput('10');
      setMessage(`Embajador creado correctamente. Código guardado como ${normalizedCode}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el embajador.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePlanSave(planId: string) {
    const nextPrice = Number(priceDrafts[planId] ?? 0);

    if (Number.isNaN(nextPrice)) {
      setMessage('Debes ingresar un precio válido.');
      return;
    }

    setIsSavingPlan(planId);
    setMessage('');

    try {
      const response = await fetch('/api/admin/plans', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: planId, basePrice: nextPrice }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el plan.');
      }

      const updatedPrice = Number(data.basePrice ?? nextPrice);

      setPlans((current) => current.map((plan) => (plan.id === planId ? { ...plan, basePrice: updatedPrice } : plan)));
      setPriceDrafts((current) => ({ ...current, [planId]: updatedPrice }));
      setMessage(`Precio actualizado para ${data.name || 'el plan'}.`);
      window.alert('¡Precio actualizado con éxito!');
    } catch (error) {
      console.error('Error actualizando plan:', error);
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar el plan.');
      window.alert(error instanceof Error ? error.message : 'No se pudo actualizar el plan.');
    } finally {
      setIsSavingPlan(null);
    }
  }

  async function handleCopyLink(code: string, ambassadorId: string) {
    const link = `${publicSiteOrigin}/?ref=${encodeURIComponent(code)}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(ambassadorId);
      setMessage('¡Enlace de afiliado copiado!');
      window.setTimeout(() => setCopiedId((current) => (current === ambassadorId ? null : current)), 1500);
    } catch (error) {
      console.error('No se pudo copiar el enlace:', error);
      setMessage('No se pudo copiar el enlace.');
    }
  }

  async function handleDeleteAmbassador(ambassadorId: string) {
    const ambassador = ambassadors.find((item) => item.id === ambassadorId);
    if (!ambassador) {
      return;
    }

    const confirmed = window.confirm(`¿Seguro que quieres eliminar a ${ambassador.name}? Esta acción no se puede deshacer.`);
    if (!confirmed) {
      return;
    }

    setIsDeletingAmbassadorId(ambassadorId);
    setMessage('');

    try {
      const response = await fetch(`/api/admin/ambassadors?id=${encodeURIComponent(ambassadorId)}`, {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo eliminar el embajador.');
      }

      setAmbassadors((current) => {
        const nextAmbassadors = current.filter((item) => item.id !== ambassadorId);

        if (selectedAmbassadorId === ambassadorId) {
          setSelectedAmbassadorId(nextAmbassadors[0]?.id ?? '');
        }

        return nextAmbassadors;
      });

      setMessage(`Embajador ${ambassador.name} eliminado correctamente.`);
    } catch (error) {
      console.error('Error eliminando embajador:', error);
      setMessage(error instanceof Error ? error.message : 'No se pudo eliminar el embajador.');
    } finally {
      setIsDeletingAmbassadorId(null);
    }
  }

  async function handleUpdateAmbassadorCommission(ambassadorId: string) {
    const draftValue = commissionDrafts[ambassadorId] ?? '';
    const parsedCommissionRate = Number(draftValue);

    if (Number.isNaN(parsedCommissionRate) || parsedCommissionRate < 0 || parsedCommissionRate > 100) {
      setMessage('La comisión debe estar entre 0 y 100.');
      return;
    }

    setIsUpdatingAmbassadorCommissionId(ambassadorId);
    setMessage('');

    try {
      const response = await fetch('/api/admin/ambassadors', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: ambassadorId, commissionRate: parsedCommissionRate }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar la comisión del embajador.');
      }

      setAmbassadors((current) =>
        current.map((ambassador) =>
          ambassador.id === ambassadorId ? { ...ambassador, commissionRate: Number(data.commissionRate ?? parsedCommissionRate) } : ambassador,
        ),
      );
      setCommissionDrafts((current) => ({
        ...current,
        [ambassadorId]: String(Number(data.commissionRate ?? parsedCommissionRate)),
      }));
      setMessage('Comisión del embajador actualizada correctamente.');
    } catch (error) {
      console.error('Error actualizando comisión del embajador:', error);
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar la comisión del embajador.');
    } finally {
      setIsUpdatingAmbassadorCommissionId(null);
    }
  }

  async function handleToggleCourse(courseId: string, isAvailable: boolean) {
    const selectedCourse = courses.find((course) => course.id === courseId);
    if (!selectedCourse) {
      return;
    }

    setIsUpdatingCourseId(courseId);
    setMessage('');

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: courseId, isAvailable }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el campo.');
      }

      setCourses((current) => current.map((course) => (course.id === courseId ? { ...course, isAvailable } : course)));
      setMessage(`Campo ${selectedCourse.name} ${isAvailable ? 'activado' : 'desactivado'} correctamente.`);
    } catch (error) {
      console.error('Error actualizando campo:', error);
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar el campo.');
    } finally {
      setIsUpdatingCourseId(null);
    }
  }

  async function handleToggleHomeFeatured(courseId: string, homeFeatured: boolean) {
    const selectedCourse = courses.find((course) => course.id === courseId);
    if (!selectedCourse) {
      return;
    }

    setIsUpdatingHomeFeaturedCourseId(courseId);
    setMessage('');

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: courseId, homeFeatured }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el campo destacado.');
      }

      setCourses((current) => current.map((course) => (course.id === courseId ? { ...course, homeFeatured } : course)));
      setMessage(`Campo ${selectedCourse.name} ${homeFeatured ? 'destacado en Home' : 'quitado de destacados'} correctamente.`);
    } catch (error) {
      console.error('Error actualizando destacado de Home:', error);
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar el campo destacado.');
    } finally {
      setIsUpdatingHomeFeaturedCourseId(null);
    }
  }

  function handleToggleQuoteCourse(courseId: string, checked: boolean) {
    setSelectedQuoteCourseIds((current) => {
      if (checked) {
        return current.includes(courseId) ? current : [...current, courseId];
      }

      return current.filter((id) => id !== courseId);
    });
  }

  function handleGenerateQuoteFromLead(lead: CustomerLead) {
    setActiveTab('quote');
    setCustomerName(lead.name || '');

    const matchingPlan = plans.find((plan) => normalizeMatchValue(plan.name) === normalizeMatchValue(lead.selectedPlan ?? ''));
    const nextSelectedPlanId = matchingPlan?.id ?? plans[0]?.id ?? '';
    setSelectedPlanId(nextSelectedPlanId);

    const nextPlayerCount = lead.playerCount && lead.playerCount > 0 ? String(lead.playerCount) : '4';
    setPlayerCount(nextPlayerCount);

    const matchingAmbassador = ambassadors.find((ambassador) => {
      if (lead.ambassadorCode && normalizeMatchValue(ambassador.code) === normalizeMatchValue(lead.ambassadorCode)) {
        return true;
      }

      return lead.ambassadorName ? normalizeMatchValue(ambassador.name) === normalizeMatchValue(lead.ambassadorName) : false;
    });
    setSelectedAmbassadorId(matchingAmbassador?.id ?? '');

    const nextCourses = courses.length > 0 ? courses.map((course) => course.id) : [];
    setSelectedQuoteCourseIds(nextCourses);
    setMessage(`Quote form prefilled from ${lead.name}'s lead.`);
  }

  async function handleUpdateQuoteStatus(quoteId: string, nextStatus: QuoteStatus) {
    setIsUpdatingQuoteStatusId(quoteId);
    setMessage('');

    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: quoteId, status: nextStatus }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo actualizar el estatus de la cotización.');
      }

      setGeneratedQuotes((current) => current.map((quote) => (quote.id === quoteId ? { ...quote, status: nextStatus } : quote)));
      setMessage('Estatus de la cotización actualizado correctamente.');
    } catch (error) {
      console.error('Error actualizando estatus de cotización:', error);
      setMessage(error instanceof Error ? error.message : 'No se pudo actualizar el estatus de la cotización.');
    } finally {
      setIsUpdatingQuoteStatusId(null);
    }
  }

  async function createGeneratedQuoteRecord() {
    if (!quotePlan) {
      throw new Error('Please select a plan before generating the quote PDF.');
    }

    const payload = {
      customerName: customerName.trim() || 'Unnamed Client',
      planName: quotePlan.name,
      packageSubtitle: quotePackageTemplate?.subtitle,
      packageDuration: quotePackageTemplate?.duration,
      hotelName: selectedHotelName.trim() || null,
      playerCount: parsedPlayers,
      ambassadorName: selectedAmbassador?.name,
      ambassadorCode: selectedAmbassador?.code,
      subtotal,
      commission,
      netMargin,
      selectedCourses: selectedQuoteCourses.map((course) => course.name),
      includedItems: quotePackageTemplate?.includes ?? [],
      status: 'PENDING' as QuoteStatus,
    };

    const response = await fetch('/api/admin/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo guardar la cotización en el histórico.');
    }

    setGeneratedQuotes((current) => [data, ...current]);
    return data as GeneratedQuote;
  }

  async function handleDownloadQuotePdf() {
    if (!quotePlan) {
      setMessage('Selecciona un plan antes de descargar la cotización.');
      return;
    }

    setIsGeneratingQuotePdf(true);

    try {
      await createGeneratedQuoteRecord();

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const marginX = 42;
      const marginY = 42;
      const contentWidth = pageWidth - marginX * 2;
      const green = '#1f5a46';
      const darkGreen = '#174437';
      const gold = '#c7a53a';
      const paleGreen = '#f2f7f2';
      const borderColor = '#d9e1d9';
      const mutedText = '#5d6b63';
      const headingText = '#223029';
      const directPaymentUrl = 'https://checkout.wompi.co/method';
      let y = marginY;

      const customerLabel = normalizePdfText(customerName.trim()) || 'Unnamed Client';
      const ambassadorLabel = normalizePdfText(selectedAmbassador?.name || '') || 'None';
      const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const packageDurationLabel = quotePackageTemplate
        ? normalizePdfText(`${quotePackageTemplate.subtitle} | ${quotePackageTemplate.duration}`)
        : 'Custom package';
      const hotelLabel = normalizePdfText(selectedHotelName.trim() || 'Hotel not selected');
      const selectedCourseNames = selectedQuoteCourses.map((course) => normalizePdfText(course.name));

      const logoDataUrl = await loadImageDataUrl(bgxLogo.src);

      const ensureSpace = (requiredHeight: number) => {
        if (y + requiredHeight > pageHeight - marginY) {
          doc.addPage();
          y = marginY;
        }
      };

      const drawRoundedBox = (x: number, boxY: number, boxWidth: number, boxHeight: number, fillColor = '#ffffff', strokeColor = borderColor, radius = 10) => {
        doc.setFillColor(fillColor);
        doc.setDrawColor(strokeColor);
        doc.roundedRect(x, boxY, boxWidth, boxHeight, radius, radius, 'FD');
      };

      const measureWrappedTextHeight = (wrapped: string | string[], lineHeight = 12) => {
        const lineCount = Array.isArray(wrapped) ? wrapped.length : 1;
        return lineCount * lineHeight;
      };

      const rebalanceWrappedLines = (wrapped: string | string[]) => {
        const lines = Array.isArray(wrapped) ? [...wrapped] : [wrapped];

        for (let index = 1; index < lines.length - 1; index += 1) {
          const currentWords = lines[index].trim().split(/\s+/).filter(Boolean);
          if (currentWords.length !== 1) {
            continue;
          }

          const previousWords = lines[index - 1].trim().split(/\s+/).filter(Boolean);
          if (previousWords.length < 3) {
            continue;
          }

          const movedWord = previousWords.pop();
          if (!movedWord) {
            continue;
          }

          lines[index - 1] = previousWords.join(' ');
          lines[index] = `${movedWord} ${lines[index]}`;
        }

        return lines;
      };

      const measureInfoCardHeight = (boxWidth: number, rows: Array<[string, string]>) => {
        return rows.reduce((height, [, value]) => {
          const wrapped = doc.splitTextToSize(normalizePdfText(value), boxWidth - 120);
          return height + Math.max(16, measureWrappedTextHeight(wrapped)) + 8;
        }, 40);
      };

      const measureCourseChipHeight = (boxWidth: number, courseName: string) => {
        const wrapped = doc.splitTextToSize(normalizePdfText(courseName), boxWidth - 24);
        return Math.max(62, 42 + measureWrappedTextHeight(wrapped));
      };

      const drawSectionHeading = (title: string, subtitle?: string) => {
        ensureSpace(34);
        doc.setDrawColor(gold);
        doc.setLineWidth(0);
        doc.setFillColor(gold);
        doc.rect(marginX, y + 6, 4, 22, 'F');
        doc.setTextColor(headingText);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(normalizePdfText(title).toUpperCase(), marginX + 12, y + 22);
        if (subtitle) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(mutedText);
          doc.text(normalizePdfText(subtitle), marginX + 12, y + 35);
        }
        y += subtitle ? 44 : 30;
      };

      const drawInfoCard = (x: number, boxY: number, boxWidth: number, boxHeight: number, title: string, rows: Array<[string, string]>) => {
        drawRoundedBox(x, boxY, boxWidth, boxHeight);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(green);
        doc.text(normalizePdfText(title).toUpperCase(), x + 14, boxY + 18);

        let rowY = boxY + 40;
        rows.forEach(([label, value]) => {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(mutedText);
          doc.text(normalizePdfText(label), x + 14, rowY);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(headingText);
          const wrapped = doc.splitTextToSize(normalizePdfText(value), boxWidth - 120);
          doc.text(wrapped, x + boxWidth - 14, rowY, { align: 'right', maxWidth: boxWidth - 28 });
          rowY += Math.max(16, measureWrappedTextHeight(wrapped)) + 8;
        });
      };

      const drawCourseChip = (x: number, boxY: number, boxWidth: number, boxHeight: number, courseName: string) => {
        const wrapped = doc.splitTextToSize(normalizePdfText(courseName), boxWidth - 24);
        drawRoundedBox(x, boxY, boxWidth, boxHeight, '#ffffff', borderColor, 8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(gold);
        doc.text('PREMIER COURSE', x + boxWidth / 2, boxY + 20, { align: 'center' });
        doc.setTextColor(headingText);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11.5);
        doc.text(wrapped, x + boxWidth / 2, boxY + 40, { align: 'center', maxWidth: boxWidth - 24 });
      };

      const drawBulletColumns = (items: string[]) => {
        const columnGap = 22;
        const columnWidth = (contentWidth - columnGap) / 2;
        const leftX = marginX;
        const rightX = marginX + columnWidth + columnGap;

        const drawBulletCard = (x: number, boxY: number, boxHeight: number, text: string) => {
          const wrapped = rebalanceWrappedLines(doc.splitTextToSize(normalizePdfText(text), columnWidth - 34));
          drawRoundedBox(x, boxY, columnWidth, boxHeight, '#ffffff', borderColor, 8);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.setTextColor(headingText);
          doc.text('-', x + 14, boxY + 18);
          doc.text(wrapped, x + 26, boxY + 18, { maxWidth: columnWidth - 32 });
        };

        for (let index = 0; index < items.length; index += 2) {
          const pair = items.slice(index, index + 2).map((item) => normalizePdfText(item));
          const heights = pair.map((item) => {
            const wrapped = rebalanceWrappedLines(doc.splitTextToSize(item, columnWidth - 34));
            return Math.max(34, measureWrappedTextHeight(wrapped) + 14);
          });
          const rowHeight = Math.max(...heights);
          ensureSpace(rowHeight + 10);

          drawBulletCard(leftX, y, rowHeight, pair[0]);
          if (pair[1]) {
            drawBulletCard(rightX, y, rowHeight, pair[1]);
          }

          y += rowHeight + 10;
        }
      };

      const drawTermsBox = () => {
        const termLines = [
          'This quote is informational and subject to availability at the time of booking confirmation.',
          'For final confirmation and payment details, please contact BGX operations.',
        ];
        const wrappedTerms = termLines.map((line) => doc.splitTextToSize(normalizePdfText(line), contentWidth - 34));
        const boxHeight = wrappedTerms.reduce((height, wrapped) => height + measureWrappedTextHeight(wrapped) + 8, 20);
        ensureSpace(boxHeight + 10);
        drawRoundedBox(marginX, y, contentWidth, boxHeight, paleGreen, '#d9e8da', 10);
        doc.setDrawColor(green);
        doc.setLineWidth(2);
        doc.line(marginX + 10, y + 10, marginX + 10, y + boxHeight - 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(mutedText);
        let termY = y + 22;
        wrappedTerms.forEach((wrapped) => {
          doc.text(wrapped, marginX + 22, termY, { maxWidth: contentWidth - 34 });
          termY += measureWrappedTextHeight(wrapped) + 8;
        });
        y += boxHeight + 10;
      };

      // Header block
      drawRoundedBox(marginX, y, contentWidth, 110, darkGreen, darkGreen, 12);
      doc.setFillColor(gold);
      doc.rect(marginX, y + 102, contentWidth, 4, 'F');
      doc.setTextColor('#ffffff');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('BGX GOLF EXPERIENCE', marginX + 20, y + 38);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor('#ead99a');
      doc.text('OFFICIAL CUSTOMIZED TRAVEL QUOTE', marginX + 20, y + 58);
      doc.setFontSize(9);
      doc.setTextColor('#d8e5de');
      doc.text('Bogota, Colombia | Tailor-made Luxury Golf Journeys', marginX + 20, y + 78);
      doc.addImage(logoDataUrl, 'PNG', pageWidth - marginX - 74, y + 16, 58, 58);
      y += 132;

      // Client and quote overview cards
      const cardGap = 18;
      const cardWidth = (contentWidth - cardGap) / 2;
      const clientCardRows: Array<[string, string]> = [
        ['Client Name', customerLabel],
        ['Referred By', ambassadorLabel],
        ['Number of Players', `${parsedPlayers} Golfers`],
      ];
      const overviewCardRows: Array<[string, string]> = [
        ['Issue Date', today],
        ['Selected Plan', quotePlan?.name ?? 'No plan selected'],
        ['Hotel', hotelLabel],
        ['Package Duration', packageDurationLabel],
      ];
      const cardHeight = Math.max(measureInfoCardHeight(cardWidth, clientCardRows), measureInfoCardHeight(cardWidth, overviewCardRows));
      ensureSpace(cardHeight + 22);
      drawInfoCard(marginX, y, cardWidth, cardHeight, 'Client & Booking Details', clientCardRows);
      drawInfoCard(marginX + cardWidth + cardGap, y, cardWidth, cardHeight, 'Quote Overview', overviewCardRows);
      y += cardHeight + 22;

      // Courses section
      drawSectionHeading('Selected Premier Golf Courses');
      if (selectedCourseNames.length === 0) {
        drawRoundedBox(marginX, y, contentWidth, 54, '#ffffff', borderColor, 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(mutedText);
        doc.text('No golf courses selected for this quote.', marginX + 16, y + 32);
        y += 68;
      } else {
        const chipGap = 12;
        const chipWidth = (contentWidth - chipGap * 2) / 3;
        for (let index = 0; index < selectedCourseNames.length; index += 3) {
          const rowCourses = selectedCourseNames.slice(index, index + 3);
          const rowHeight = Math.max(...rowCourses.map((courseName) => measureCourseChipHeight(chipWidth, courseName)));
          ensureSpace(rowHeight + 6);

          rowCourses.forEach((courseName, column) => {
            const chipX = marginX + column * (chipWidth + chipGap);
            drawCourseChip(chipX, y, chipWidth, rowHeight, courseName);
          });

          y += rowHeight + 12;
        }
      }

      // Package inclusions
      drawSectionHeading('Package Inclusions');
      if (!quotePackageTemplate) {
        drawRoundedBox(marginX, y, contentWidth, 54, '#ffffff', borderColor, 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(mutedText);
        doc.text('No package inclusions template configured for this plan.', marginX + 16, y + 32);
        y += 68;
      } else {
        drawBulletColumns(quotePackageTemplate.includes);
        y += 8;
      }

      // Financial summary
      drawSectionHeading('Financial Summary');
      const summaryHeight = 92;
      ensureSpace(summaryHeight + 16);
      drawRoundedBox(marginX, y, contentWidth, summaryHeight, '#ffffff', borderColor, 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(mutedText);
      doc.text(`BGX Smart Pack Subtotal (${parsedPlayers} Players)`, marginX + 20, y + 30);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(headingText);
      doc.text(formatCurrencyUSD(subtotal), pageWidth - marginX - 20, y + 30, { align: 'right' });
      doc.setDrawColor(gold);
      doc.setLineWidth(1);
      doc.line(marginX + 20, y + 42, pageWidth - marginX - 20, y + 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(17);
      doc.setTextColor(green);
      doc.text('Total Quote Amount', marginX + 20, y + 66);
      doc.text(formatCurrencyUSD(subtotal), pageWidth - marginX - 20, y + 66, { align: 'right' });
      y += summaryHeight + 16;

      // Direct payment link
      drawSectionHeading('Direct Payment');
      const paymentBoxHeight = 56;
      ensureSpace(paymentBoxHeight + 10);
      drawRoundedBox(marginX, y, contentWidth, paymentBoxHeight, '#ffffff', borderColor, 10);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(headingText);
      doc.text('To pay directly from this quote,', marginX + 16, y + 24);
      const linkX = marginX + 170;
      const linkY = y + 24;
      doc.setTextColor(green);
      doc.setFont('helvetica', 'bold');
      doc.text('click here.', linkX, linkY);
      const linkWidth = doc.getTextWidth('click here.');
      doc.link(linkX, linkY - 9, linkWidth, 12, { url: directPaymentUrl });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(mutedText);
      doc.text(directPaymentUrl, marginX + 16, y + 42);
      y += paymentBoxHeight + 12;

      // Terms
      drawSectionHeading('Important Terms & Conditions');
      drawTermsBox();

      // Footer
      doc.setDrawColor('#d6ddd6');
      doc.setLineWidth(0.8);
      doc.line(marginX, pageHeight - 46, pageWidth - marginX, pageHeight - 46);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(mutedText);
      doc.text('BGX Golf Experience | Bogota, Colombia | Tailor-made Luxury Golf Journeys', pageWidth / 2, pageHeight - 30, { align: 'center' });

      const safeCustomerName = customerLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'client';
      const fileDate = new Date().toISOString().slice(0, 10);

      doc.save(`bgx-quote-${safeCustomerName}-${fileDate}.pdf`);
      setMessage('Cotización en PDF descargada y guardada en Generated Quotes.');
    } catch (error) {
      console.error('Error generando PDF de cotización:', error);
      setMessage(error instanceof Error ? error.message : 'No se pudo generar el PDF de la cotización.');
    } finally {
      setIsGeneratingQuotePdf(false);
    }
  }

  const quotePlan = plans.find((plan) => plan.id === selectedPlanId);
  const selectedAmbassador = ambassadors.find((ambassador) => ambassador.id === selectedAmbassadorId);
  const parsedPlayers = Number(playerCount) || 0;
  const subtotal = (quotePlan?.basePrice ?? 0) * parsedPlayers;
  const selectedAmbassadorCommissionRate = selectedAmbassador?.commissionRate ?? 0;
  const commission = selectedAmbassador ? subtotal * (selectedAmbassadorCommissionRate / 100) : 0;
  const netMargin = subtotal - commission;
  const homeFeaturedCourses = [...courses].sort((firstCourse, secondCourse) => {
    if (firstCourse.homeFeatured === secondCourse.homeFeatured) {
      return firstCourse.name.localeCompare(secondCourse.name);
    }

    return Number(secondCourse.homeFeatured) - Number(firstCourse.homeFeatured);
  });
  const homeFeaturedCount = courses.filter((course) => course.homeFeatured).length;
  const canSelectMoreHomeFeatured = homeFeaturedCount < 6;
  const coursesPageOnlyCourses = courses.filter((course) => !course.homeFeatured);
  const selectedQuoteCourses = courses.filter((course) => selectedQuoteCourseIds.includes(course.id));
  const quotePackageTemplate = getQuotePackageTemplate(quotePlan?.name);
  const leadSourceOptions = Array.from(new Set((customerLeads.map((lead) => lead.source).filter(Boolean)) as string[]));
  const leadAmbassadorOptions = Array.from(new Set((customerLeads.map((lead) => lead.ambassadorName).filter(Boolean)) as string[]));
  const filteredCustomerLeads = [...customerLeads]
    .sort((firstLead, secondLead) => new Date(secondLead.createdAt).getTime() - new Date(firstLead.createdAt).getTime())
    .filter((lead) => {
      const searchValue = leadSearch.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        lead.name.toLowerCase().includes(searchValue) ||
        lead.email.toLowerCase().includes(searchValue) ||
        lead.phone.toLowerCase().includes(searchValue) ||
        (lead.city ?? '').toLowerCase().includes(searchValue) ||
        (lead.country ?? '').toLowerCase().includes(searchValue);

      const matchesSource = leadFilterSource === 'all' || (lead.source ?? 'Sin origen') === leadFilterSource;
      const matchesAmbassador =
        leadFilterAmbassador === 'all' || (lead.ambassadorName ?? 'Sin embajador') === leadFilterAmbassador;

      return matchesSearch && matchesSource && matchesAmbassador;
    });

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700">
                BGX Superadmin
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-zinc-900 sm:text-4xl">
                Gestión local del negocio
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-600">
                Gestiona embajadores, ajusta precios de planes y genera cotizaciones internas desde una base SQLite local.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          {[
            { id: 'ambassadors', label: 'Embajadores' },
            { id: 'plans', label: 'Manage Plans' },
            { id: 'courses', label: 'Campos Activos' },
            { id: 'quote', label: 'Quote Generator' },
            { id: 'generatedQuotes', label: 'Generated Quotes' },
            { id: 'leads', label: 'Potential Clients' },
            { id: 'blogs', label: 'Blogs' },
            { id: 'terms', label: 'Terms' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as 'ambassadors' | 'plans' | 'quote' | 'courses' | 'generatedQuotes' | 'leads' | 'blogs' | 'terms')}
              style={
                activeTab === tab.id
                  ? { backgroundColor: '#1f2d1f', color: '#ffffff' }
                  : { backgroundColor: '#e8ede4', color: '#1f2d1f' }
              }
              className="rounded-lg px-4 py-2 font-medium transition-colors hover:brightness-95"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}

        {activeTab === 'ambassadors' ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-900">Embajadores activos</h2>
                  <p className="mt-1 text-sm text-zinc-600">Datos guardados en SQLite local.</p>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                <table className="min-w-full table-fixed divide-y divide-zinc-200 text-left text-sm">
                  <thead className="bg-zinc-100 text-zinc-800">
                    <tr>
                      <th className="w-[12%] px-3 py-2.5 font-medium">Nombre</th>
                      <th className="w-[17%] px-3 py-2.5 font-medium">Email</th>
                      <th className="w-[8%] px-3 py-2.5 font-medium">Código</th>
                      <th className="w-[17%] px-3 py-2.5 font-medium">Comisión</th>
                      <th className="w-[30%] px-3 py-2.5 font-medium">Enlace de afiliado</th>
                      <th className="w-[6%] px-3 py-2.5 text-center font-medium">Estado</th>
                      <th className="w-[10%] px-3 py-2.5 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {ambassadors.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-zinc-700">
                          Aún no hay embajadores registrados.
                        </td>
                      </tr>
                    ) : (
                      ambassadors.map((ambassador) => (
                        <tr key={ambassador.id} className="text-zinc-700">
                          <td className="px-3 py-2.5 font-medium align-middle">{ambassador.name}</td>
                          <td className="px-3 py-2.5 align-middle">{ambassador.email}</td>
                          <td className="px-3 py-2.5 align-middle">{ambassador.code}</td>
                          <td className="px-3 py-2.5 align-middle">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={commissionDrafts[ambassador.id] ?? ''}
                                onChange={(event) =>
                                  setCommissionDrafts((current) => ({
                                    ...current,
                                    [ambassador.id]: event.target.value,
                                  }))
                                }
                                className="w-20 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                              />
                              <span className="text-xs text-zinc-600">%</span>
                              <button
                                type="button"
                                onClick={() => void handleUpdateAmbassadorCommission(ambassador.id)}
                                disabled={isUpdatingAmbassadorCommissionId === ambassador.id}
                                className="rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isUpdatingAmbassadorCommissionId === ambassador.id ? 'Guardando...' : 'Guardar'}
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 align-middle">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <a
                                href={`${publicSiteOrigin}/?ref=${encodeURIComponent(ambassador.code)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block max-w-[260px] truncate text-sm font-medium text-emerald-700 underline decoration-dotted underline-offset-4"
                              >
                                {`${publicSiteOrigin}/?ref=${encodeURIComponent(ambassador.code)}`}
                              </a>
                              <button
                                type="button"
                                onClick={() => void handleCopyLink(ambassador.code, ambassador.id)}
                                className="shrink-0 rounded-full border border-zinc-300 px-2.5 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                              >
                                {copiedId === ambassador.id ? '¡Copiado!' : 'Copiar'}
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 align-middle">
                            <div className="flex items-center justify-center">
                              <span
                                className="inline-block"
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '9999px',
                                  border: '1px solid rgba(0,0,0,0.08)',
                                  backgroundColor: isAmbassadorActive(ambassador.status) ? '#10b981' : '#ef4444',
                                  boxShadow: '0 0 0 1px rgba(255,255,255,0.9) inset',
                                }}
                                title={ambassador.status}
                                aria-label={`Estado ${ambassador.status}`}
                              />
                            </div>
                          </td>
                          <td className="px-3 py-2.5 align-middle">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => void handleDeleteAmbassador(ambassador.id)}
                                disabled={isDeletingAmbassadorId === ambassador.id}
                                className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isDeletingAmbassadorId === ambassador.id ? 'Eliminando...' : 'Eliminar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">Estadísticas generales de clics</h3>
                    <p className="mt-1 text-sm text-zinc-600">Ranking general por embajador según los enlaces afiliados compartidos.</p>
                  </div>
                </div>

                {isLoadingGeneralAmbassadorStats ? (
                  <div className="mt-4 rounded-2xl border border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
                    Cargando ranking general de clics...
                  </div>
                ) : generalAmbassadorStats.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-zinc-200 bg-white px-4 py-5 text-sm text-zinc-600">
                    Aún no hay clics registrados para ningún embajador.
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-200 bg-white">
                    <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                      <thead className="bg-zinc-100 text-zinc-800">
                        <tr>
                          <th className="px-4 py-3 font-medium">#</th>
                          <th className="px-4 py-3 font-medium">Embajador</th>
                          <th className="px-4 py-3 font-medium">Clics</th>
                          <th className="px-4 py-3 font-medium">URL principal</th>
                          <th className="px-4 py-3 font-medium">Último clic</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-200 bg-white">
                        {generalAmbassadorStats.map((stat, index) => (
                          <tr key={stat.ambassadorId} className="text-zinc-700">
                            <td className="px-4 py-3 font-semibold">{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="font-medium text-zinc-900">{stat.ambassadorName}</div>
                              <div className="text-xs text-zinc-500">{stat.ambassadorCode}</div>
                            </td>
                            <td className="px-4 py-3 font-semibold">{stat.totalClicks}</td>
                            <td className="px-4 py-3">
                              {stat.topUrl ? (
                                <a href={stat.topUrl} target="_blank" rel="noreferrer" className="max-w-[320px] truncate font-medium text-emerald-700 underline decoration-dotted underline-offset-4">
                                  {stat.topUrl}
                                </a>
                              ) : (
                                <span className="text-zinc-500">Sin datos</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {stat.lastClickedAt
                                ? new Date(stat.lastClickedAt).toLocaleString('es-CO', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : 'Sin clics'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-zinc-900">Agregar embajador</h2>
              <p className="mt-2 text-sm text-zinc-600">Completa los campos para crear uno nuevo.</p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-700">
                    Nombre completo
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-700">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                    placeholder="juan@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="code" className="mb-2 block text-sm font-medium text-zinc-700">
                    Código único
                  </label>
                  <input
                    id="code"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                    placeholder="BGX-001"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="commissionRate" className="mb-2 block text-sm font-medium text-zinc-700">
                    Comisión del embajador (%)
                  </label>
                  <input
                    id="commissionRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={commissionRateInput}
                    onChange={(event) => setCommissionRateInput(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                    placeholder="10"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#1f2d1f', color: '#ffffff' }}
                  className="w-full rounded-2xl px-4 py-3 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar embajador'}
                </button>
              </form>
            </section>
          </div>
        ) : null}

        {activeTab === 'plans' ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-900">Manage Plans</h2>
              <p className="mt-2 text-sm text-zinc-600">Actualiza los precios base de los paquetes visibles en la landing page.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {plans.map((plan) => (
                <div key={plan.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-900">{plan.name}</h3>
                      <p className="mt-2 text-sm text-zinc-600">{plan.description}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      ${plan.basePrice}
                    </span>
                  </div>

                  <div className="mt-4">
                    <label htmlFor={`plan-${plan.id}`} className="mb-2 block text-sm font-medium text-zinc-700">
                      Precio base (USD)
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        id={`plan-${plan.id}`}
                        type="number"
                        min="0"
                        value={priceDrafts[plan.id] ?? ''}
                        onChange={(event) => setPriceDrafts((current) => ({ ...current, [plan.id]: Number(event.target.value) }))}
                        className="bg-white border border-zinc-300 text-zinc-900 p-2 rounded-lg w-full font-semibold"
                      />
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          void handlePlanSave(plan.id);
                        }}
                        disabled={isSavingPlan === plan.id}
                        style={{ backgroundColor: '#1f2d1f', color: '#ffffff' }}
                        className="block rounded-lg px-4 py-2 text-center font-bold transition-colors hover:brightness-110"
                      >
                        {isSavingPlan === plan.id ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'courses' ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-900">Campos Activos</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Selecciona qué campos de golf se mostrarán en la página pública.
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Activos: {courses.filter((course) => course.isAvailable).length} de {courses.length}
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <h3 className="text-base font-semibold text-zinc-900">Campos del Home (destacados)</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Elige hasta 6 campos para destacar en la sección principal del Home.
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  Seleccionados: {homeFeaturedCount} de 6
                </p>
                <div className="mt-3 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                  {homeFeaturedCourses.map((course) => (
                    <label
                      key={course.id}
                      htmlFor={`course-${course.id}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-zinc-900">{course.name}</p>
                        <p className="text-xs text-zinc-500">
                          Disponible: {course.isAvailable ? 'Sí' : 'No'}
                        </p>
                        <p className="text-xs text-zinc-500">
                          Home: {course.homeFeatured ? 'Destacado' : 'No destacado'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {isUpdatingHomeFeaturedCourseId === course.id ? (
                          <span className="text-xs text-zinc-500">Guardando...</span>
                        ) : null}
                        <input
                          id={`course-${course.id}`}
                          type="checkbox"
                          checked={course.homeFeatured}
                          disabled={isUpdatingHomeFeaturedCourseId === course.id || (!course.homeFeatured && !canSelectMoreHomeFeatured)}
                          onChange={(event) => void handleToggleHomeFeatured(course.id, event.target.checked)}
                          className="h-5 w-5 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-700"
                        />
                      </div>
                    </label>
                  ))}
                  {!canSelectMoreHomeFeatured ? (
                    <p className="px-1 text-xs text-amber-700">
                      Ya seleccionaste 6 destacados. Desmarca uno para elegir otro.
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <h3 className="text-base font-semibold text-zinc-900">Campos exclusivos de la página Courses</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Catálogo extendido que se muestra en la página de Courses.
                </p>
                <div className="mt-3 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                  {coursesPageOnlyCourses.map((course) => (
                    <label
                      key={course.id}
                      htmlFor={`course-${course.id}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-zinc-900">{course.name}</p>
                        <p className="text-xs text-zinc-500">
                          Disponible: {course.isAvailable ? 'Sí' : 'No'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {isUpdatingCourseId === course.id ? (
                          <span className="text-xs text-zinc-500">Guardando...</span>
                        ) : null}
                        <input
                          id={`course-${course.id}`}
                          type="checkbox"
                          checked={course.isAvailable}
                          disabled={isUpdatingCourseId === course.id}
                          onChange={(event) => void handleToggleCourse(course.id, event.target.checked)}
                          className="h-5 w-5 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-700"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'generatedQuotes' ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-zinc-900">Generated Quotes</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Histórico completo de cotizaciones generadas y estatus de compra.
              </p>
            </div>

            {generatedQuotes.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-zinc-600">
                Aún no hay cotizaciones generadas.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                  <thead className="bg-zinc-100 text-zinc-800">
                    <tr>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 font-medium">Plan</th>
                      <th className="px-4 py-3 font-medium">Hotel</th>
                      <th className="px-4 py-3 font-medium">Jugadores</th>
                      <th className="px-4 py-3 font-medium">Campos</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                      <th className="px-4 py-3 font-medium">Estatus compra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {generatedQuotes.map((quote) => {
                      const selectedCourses = parseJsonArray(quote.selectedCoursesJson) as string[];

                      return (
                        <tr key={quote.id} className="text-zinc-700">
                          <td className="px-4 py-3">
                            {new Date(quote.createdAt).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="px-4 py-3 font-medium">{quote.customerName}</td>
                          <td className="px-4 py-3">{quote.planName}</td>
                          <td className="px-4 py-3">{quote.hotelName || 'Sin hotel'}</td>
                          <td className="px-4 py-3">{quote.playerCount}</td>
                          <td className="px-4 py-3">
                            <p>{selectedCourses.length} selected</p>
                            <p className="text-xs text-zinc-500">
                              {selectedCourses.slice(0, 2).join(', ')}{selectedCourses.length > 2 ? '...' : ''}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-semibold">{formatCurrencyUSD(quote.subtotal)}</td>
                          <td className="px-4 py-3">
                            <select
                              value={quote.status}
                              disabled={isUpdatingQuoteStatusId === quote.id}
                              onChange={(event) => void handleUpdateQuoteStatus(quote.id, event.target.value as QuoteStatus)}
                              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-900 outline-none transition focus:border-zinc-500"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="BOUGHT">Bought</option>
                              <option value="NOT_BOUGHT">Not Bought</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}

        {activeTab === 'leads' ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Potential Clients</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Leads generados desde el formulario público, con consentimiento y origen del cliente.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleClearTestLeads()}
                disabled={isClearingLeads || customerLeads.length === 0}
                className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isClearingLeads ? 'Clearing...' : 'Clear test leads'}
              </button>
            </div>

            <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <label htmlFor="lead-search" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                  Buscar lead
                </label>
                <input
                  id="lead-search"
                  value={leadSearch}
                  onChange={(event) => setLeadSearch(event.target.value)}
                  placeholder="Nombre, email, teléfono o ciudad"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
                <div>
                  <label htmlFor="lead-source-filter" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Origen
                  </label>
                  <select
                    id="lead-source-filter"
                    value={leadFilterSource}
                    onChange={(event) => setLeadFilterSource(event.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                  >
                    <option value="all">Todos</option>
                    {leadSourceOptions.map((source) => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="lead-ambassador-filter" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                    Embajador
                  </label>
                  <select
                    id="lead-ambassador-filter"
                    value={leadFilterAmbassador}
                    onChange={(event) => setLeadFilterAmbassador(event.target.value)}
                    className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                  >
                    <option value="all">Todos</option>
                    {leadAmbassadorOptions.map((ambassador) => (
                      <option key={ambassador} value={ambassador}>{ambassador}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredCustomerLeads.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-center text-zinc-600">
                No hay leads que coincidan con los filtros actuales.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                <table className="min-w-full divide-y divide-zinc-200 text-left text-sm">
                  <thead className="bg-zinc-100 text-zinc-800">
                    <tr>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                      <th className="px-4 py-3 font-medium">Cliente</th>
                      <th className="px-4 py-3 font-medium">Contacto</th>
                      <th className="px-4 py-3 font-medium">Ubicación</th>
                      <th className="px-4 py-3 font-medium">Intent</th>
                      <th className="px-4 py-3 font-medium">Cuota</th>
                      <th className="px-4 py-3 font-medium">Origen</th>
                      <th className="px-4 py-3 font-medium">Embajador</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 bg-white">
                    {filteredCustomerLeads.map((lead) => (
                      <tr key={lead.id} className="align-top text-zinc-700">
                        <td className="px-4 py-3">
                          {new Date(lead.createdAt).toLocaleString('es-CO', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-zinc-900">{lead.name}</div>
                          {lead.selectedPlan ? (
                            <div className="mt-1 text-xs text-zinc-500">Plan: {lead.selectedPlan}</div>
                          ) : null}
                        </td>
                        <td className="px-4 py-3">
                          <div>{lead.email}</div>
                          <div className="mt-1 text-xs text-zinc-500">{lead.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div>{lead.country}</div>
                          <div className="mt-1 text-xs text-zinc-500">{lead.city || lead.state || 'Sin ciudad'}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                            {lead.intent}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-zinc-900">
                            {lead.playerCount ? `${lead.playerCount} players` : 'Sin jugadores'}
                          </div>
                          <div className="mt-1 text-xs text-zinc-500">
                            {lead.estimatedTotal != null ? `$${lead.estimatedTotal.toLocaleString('en-US')}` : 'Sin total'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-zinc-600">{lead.source || 'Sin origen'}</div>
                          <div className="mt-2 text-[11px] text-zinc-500">
                            Marketing: {lead.consentMarketing ? 'Sí' : 'No'}
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            Privacy: {lead.consentPrivacy ? 'Sí' : 'No'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {lead.ambassadorName ? (
                            <>
                              <div className="font-medium text-zinc-900">{lead.ambassadorName}</div>
                              <div className="mt-1 text-xs text-zinc-500">{lead.ambassadorCode || 'Sin código'}</div>
                            </>
                          ) : (
                            <span className="text-xs text-zinc-500">Sin embajador</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => handleGenerateQuoteFromLead(lead)}
                            className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-semibold text-zinc-900 transition hover:bg-emerald-800"
                          >
                            Generate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : null}

        {activeTab === 'quote' ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-zinc-900">Quote Generator</h2>
              <p className="mt-2 text-sm text-zinc-600">Herramienta interna para cotizar paquetes con comisión simulada.</p>

              <form className="mt-6 space-y-4">
                <div>
                  <label htmlFor="customerName" className="mb-2 block text-sm font-medium text-zinc-700">
                    Nombre del cliente
                  </label>
                  <input
                    id="customerName"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                    placeholder="Cliente premium"
                  />
                </div>

                <div>
                  <label htmlFor="planSelect" className="mb-2 block text-sm font-medium text-zinc-700">
                    Plan seleccionado
                  </label>
                  <select
                    id="planSelect"
                    value={selectedPlanId}
                    onChange={(event) => setSelectedPlanId(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id} className="text-zinc-900">
                        {plan.name} — ${plan.basePrice}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="hotelSelect" className="mb-2 block text-sm font-medium text-zinc-700">
                    Hotel
                  </label>
                  <select
                    id="hotelSelect"
                    value={selectedHotelName}
                    onChange={(event) => setSelectedHotelName(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                  >
                    {HOTEL_OPTIONS.map((hotelName) => (
                      <option key={hotelName} value={hotelName} className="text-zinc-900">
                        {hotelName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="playerCount" className="mb-2 block text-sm font-medium text-zinc-700">
                    Número de jugadores
                  </label>
                  <input
                    id="playerCount"
                    type="number"
                    min="1"
                    value={playerCount}
                    onChange={(event) => setPlayerCount(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-500"
                  />
                </div>

                <div>
                  <label htmlFor="ambassadorSelect" className="mb-2 block text-sm font-medium text-zinc-700">
                    Embajador referente
                  </label>
                  <select
                    id="ambassadorSelect"
                    value={selectedAmbassadorId}
                    onChange={(event) => setSelectedAmbassadorId(event.target.value)}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                  >
                    <option value="" className="text-zinc-900">
                      None - no commission
                    </option>
                    {ambassadors.map((ambassador) => (
                      <option key={ambassador.id} value={ambassador.id} className="text-zinc-900">
                        {ambassador.name} ({ambassador.code}) - {ambassador.commissionRate}%
                      </option>
                    ))}
                  </select>
                  {!selectedAmbassador ? (
                    <p className="mt-2 text-xs text-zinc-500">
                      No hay embajador referente seleccionado, por lo tanto no se aplica comisión.
                    </p>
                  ) : null}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-zinc-700">
                      Campos incluidos en el quote
                    </label>
                    <div className="flex items-center gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedQuoteCourseIds(courses.map((course) => course.id))}
                        className="rounded-full border border-zinc-300 px-2.5 py-1 font-semibold text-zinc-700 transition hover:bg-zinc-100"
                      >
                        Seleccionar todos
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedQuoteCourseIds([])}
                        className="rounded-full border border-zinc-300 px-2.5 py-1 font-semibold text-zinc-700 transition hover:bg-zinc-100"
                      >
                        Limpiar
                      </button>
                    </div>
                  </div>

                  <div className="max-h-72 overflow-y-auto rounded-2xl border border-zinc-300 bg-zinc-50 p-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {courses.map((course) => (
                      <label
                        key={course.id}
                        htmlFor={`quote-course-${course.id}`}
                        className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2"
                      >
                        <input
                          id={`quote-course-${course.id}`}
                          type="checkbox"
                          checked={selectedQuoteCourseIds.includes(course.id)}
                          onChange={(event) => handleToggleQuoteCourse(course.id, event.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-700"
                        />
                        <div>
                          <p className="text-sm font-medium leading-5 text-zinc-900">{course.name}</p>
                          <p className="text-[11px] text-zinc-500">
                            {course.isAvailable ? 'Activo en la web' : 'Inactivo en la web'}
                          </p>
                        </div>
                      </label>
                    ))}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-zinc-500">
                    Seleccionados: {selectedQuoteCourseIds.length} de {courses.length}
                  </p>
                </div>
              </form>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-zinc-900">Vista previa</h3>
              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm text-zinc-600">Cliente</p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{customerName || 'Sin nombre'}</p>
                <p className="mt-4 text-sm text-zinc-600">Plan</p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{quotePlan?.name || 'Sin plan seleccionado'}</p>
                <p className="mt-4 text-sm text-zinc-600">Hotel</p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">{selectedHotelName || 'Sin hotel seleccionado'}</p>
                {quotePackageTemplate ? (
                  <p className="mt-1 text-sm text-zinc-600">
                    {quotePackageTemplate.subtitle} • {quotePackageTemplate.duration}
                  </p>
                ) : null}

                <p className="mt-4 text-sm text-zinc-600">Referenciado por</p>
                <p className="mt-1 text-lg font-semibold text-zinc-900">
                  {selectedAmbassador ? selectedAmbassador.name : 'Sin referencia'}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-zinc-600">Subtotal</span>
                    <span className="font-semibold text-zinc-900">${subtotal.toLocaleString('en-US')}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                    <span className="text-zinc-600">Comisión del embajador</span>
                    <span className="font-semibold text-zinc-900">
                      {selectedAmbassador ? `${selectedAmbassadorCommissionRate}% (${formatCurrencyUSD(commission)})` : 'Sin comisión'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-emerald-100 px-4 py-3">
                    <span className="text-emerald-700">Total cotización</span>
                    <span className="font-semibold text-emerald-700">${subtotal.toLocaleString('en-US')}</span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-zinc-600">Campos incluidos en la cotización</p>
                  {selectedQuoteCourses.length === 0 ? (
                    <p className="mt-2 text-sm text-zinc-500">No hay campos seleccionados.</p>
                  ) : (
                    <ul className="mt-2 space-y-1 text-sm text-zinc-900">
                      {selectedQuoteCourses.map((course) => (
                        <li key={course.id}>• {course.name}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-4 rounded-xl bg-white px-4 py-3 shadow-sm">
                  <p className="text-zinc-600">Items incluidos en la cotización</p>
                  {quotePackageTemplate ? (
                    <ul className="mt-2 space-y-1 text-sm text-zinc-900">
                      {quotePackageTemplate.includes.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-zinc-500">
                      No hay plantilla de inclusiones configurada para este plan.
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleDownloadQuotePdf}
                  disabled={isGeneratingQuotePdf}
                  style={{ backgroundColor: '#1f2d1f', color: '#ffffff' }}
                  className="mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isGeneratingQuotePdf ? 'Generating PDF...' : 'Download Quote PDF (English)'}
                </button>
              </div>
            </section>
          </div>
        ) : null}

        {activeTab === 'terms' ? (
          <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900">Terms</h2>
                <p className="mt-2 text-sm text-zinc-600">Edita la política legal pública del sitio y actualiza texto conforme cambien las regulaciones.</p>
              </div>
              <button
                type="button"
                onClick={handleSaveLegalPage}
                disabled={isSavingLegalPage}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingLegalPage ? 'Saving...' : 'Save changes'}
              </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              {[
                { slug: 'privacy-policy', label: 'Privacy Policy' },
                { slug: 'terms-of-service', label: 'Terms of Service' },
                { slug: 'cookie-policy', label: 'Cookie Policy' },
              ].map((tab) => (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => setLegalPageSlug(tab.slug as 'privacy-policy' | 'terms-of-service' | 'cookie-policy')}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    legalPageSlug === tab.slug ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="legalTitle" className="mb-2 block text-sm font-medium text-zinc-700">
                  Page title
                </label>
                <input
                  id="legalTitle"
                  value={legalPageTitle}
                  onChange={(event) => setLegalPageTitle(event.target.value)}
                  className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                />
              </div>

              <div>
                <label htmlFor="legalContent" className="mb-2 block text-sm font-medium text-zinc-700">
                  Legal content
                </label>
                <textarea
                  id="legalContent"
                  value={legalPageContent}
                  onChange={(event) => setLegalPageContent(event.target.value)}
                  className="min-h-[420px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                  placeholder="Escribe aquí el texto legal..."
                />
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'blogs' ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-900">Create / Edit Blog Post</h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Publish SEO-friendly content for the site. Published posts appear under the Blogs menu tab.
                </p>
              </div>

              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div>
                  <label htmlFor="blogTitle" className="mb-2 block text-sm font-medium text-zinc-700">
                    Title
                  </label>
                  <input
                    id="blogTitle"
                    value={blogTitle}
                    onChange={(event) => {
                      const value = event.target.value;
                      setBlogTitle(value);
                      if (!editingBlogId) {
                        setBlogSlug(normalizeSlug(value));
                      }
                    }}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                    placeholder="Top 7 golf courses in Bogota for travelers"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="blogSlug" className="mb-2 block text-sm font-medium text-zinc-700">
                    Slug (URL)
                  </label>
                  <input
                    id="blogSlug"
                    value={blogSlug}
                    onChange={(event) => setBlogSlug(normalizeSlug(event.target.value))}
                    className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                    placeholder="top-7-golf-courses-in-bogota"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="blogExcerpt" className="mb-2 block text-sm font-medium text-zinc-700">
                    SEO Excerpt
                  </label>
                  <textarea
                    id="blogExcerpt"
                    value={blogExcerpt}
                    onChange={(event) => setBlogExcerpt(event.target.value)}
                    className="min-h-[88px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                    placeholder="Short summary shown in listings and metadata"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-700">
                    Cover Image (optional)
                  </label>
                  <input
                    ref={blogCoverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => void handleBlogCoverImageInputChange(event)}
                  />
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDraggingBlogCoverImage(true);
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault();
                      setIsDraggingBlogCoverImage(false);
                    }}
                    onDrop={(event) => void handleBlogCoverImageDrop(event)}
                    className={`rounded-2xl border-2 border-dashed px-4 py-6 text-center transition ${
                      isDraggingBlogCoverImage ? 'border-emerald-500 bg-emerald-50' : 'border-zinc-300 bg-zinc-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-zinc-700">
                      Drag and drop an image here, or choose a file
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">Accepted image files up to 2 MB.</p>
                    <button
                      type="button"
                      onClick={() => blogCoverInputRef.current?.click()}
                      className="mt-4 rounded-full border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                    >
                      Select image
                    </button>
                    {isProcessingBlogCoverImage ? (
                      <p className="mt-3 text-xs font-medium text-emerald-700">Processing image...</p>
                    ) : null}
                  </div>

                  {blogCoverImage ? (
                    <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
                      <img src={blogCoverImage} alt="Blog cover preview" className="h-40 w-full rounded-xl object-cover" />
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-zinc-600">
                          {blogCoverImageFileName || 'Current cover image loaded'}
                        </p>
                        <button
                          type="button"
                          onClick={clearBlogCoverImage}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
                        >
                          Remove image
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="blogContent" className="mb-2 block text-sm font-medium text-zinc-700">
                    Content
                  </label>
                  <textarea
                    id="blogContent"
                    value={blogContent}
                    onChange={(event) => setBlogContent(event.target.value)}
                    className="min-h-[240px] w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-zinc-500"
                    placeholder="Write the article content. Use line breaks to separate paragraphs."
                    required
                  />
                </div>

                <label className="flex items-center gap-3 text-sm font-medium text-zinc-700">
                  <input
                    type="checkbox"
                    checked={blogPublished}
                    onChange={(event) => setBlogPublished(event.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-700"
                  />
                  Publish immediately
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingBlog}
                    style={{ backgroundColor: '#1f2d1f', color: '#ffffff' }}
                    className="rounded-2xl px-5 py-2.5 font-semibold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSavingBlog ? 'Saving...' : editingBlogId ? 'Update post' : 'Create post'}
                  </button>
                  {editingBlogId ? (
                    <button
                      type="button"
                      onClick={resetBlogForm}
                      className="rounded-2xl border border-zinc-300 px-5 py-2.5 font-semibold text-zinc-700 transition hover:bg-zinc-100"
                    >
                      Cancel editing
                    </button>
                  ) : null}
                </div>
              </form>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-lg shadow-zinc-200/70 backdrop-blur-xl">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-900">Existing Blog Posts</h2>
                <p className="mt-2 text-sm text-zinc-600">Manage publication status and edit your articles.</p>
              </div>

              {blogs.length === 0 ? (
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-zinc-600">
                  No blog posts yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {blogs.map((blog) => (
                    <article key={blog.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-zinc-900">{blog.title}</p>
                          <p className="mt-1 text-xs text-zinc-600">/{blog.slug}</p>
                          <p className="mt-2 text-sm text-zinc-700 line-clamp-2">{blog.excerpt}</p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${blog.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-700'}`}
                        >
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => startEditingBlog(blog)}
                          className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteBlog(blog.id)}
                          disabled={isDeletingBlogId === blog.id}
                          className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeletingBlogId === blog.id ? 'Deleting...' : 'Delete'}
                        </button>
                        {blog.isPublished ? (
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
                          >
                            View live
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
