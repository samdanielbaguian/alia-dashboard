import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';

export async function generateMetadata({ params }) {
  const id = params.id;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  try {
    const res = await fetch(`${base}/products/${encodeURIComponent(id)}`, { cache: 'no-store' });
    if (!res.ok) return { title: `Product` };
    const p = await res.json();
    return {
      title: p.title,
      description: p.description ? p.description.slice(0, 160) : '',
      openGraph: {
        title: p.title,
        description: p.description ? p.description.slice(0, 160) : '',
        images: p.images && p.images[0] ? p.images[0] : undefined
      }
    };
  } catch (e) {
    return { title: `Product` };
  }
}

export default async function ProductPage({ params }) {
  const id = params.id;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const res = await fetch(`${base}/products/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) return <DashboardLayout><div style={{padding:20}}>Product not found</div></DashboardLayout>;
  const p = await res.json();

  // Minimal JSON-LD Product structured data
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": p.title,
    "image": p.images || [],
    "description": p.description || '',
    "sku": p.sku || undefined,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": String(p.price),
      "availability": p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `${process.env.NEXT_PUBLIC_SITE_ORIGIN || 'http://localhost:3000'}/product/${p.id}`
    }
  };

  // Fetch merchant to build a public storefront link (server-side)
  let merchant = null;
  try {
    const mres = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/merchants/${encodeURIComponent(p.merchant_id)}`, { cache: 'no-store' });
    if (mres.ok) merchant = await mres.json();
  } catch (e) {
    merchant = null;
  }

  const slugify = (s = '') => {
    return s.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const storeSlug = merchant && merchant.shop_name ? slugify(merchant.shop_name) : null;

  return (
    <DashboardLayout>
      <div style={{maxWidth:920, margin:'0 auto', padding:20}}>
        <div style={{display:'flex', gap:20}}>
          <div style={{flex:'0 0 420px'}}>
            <img src={p.images && p.images[0] ? p.images[0] : '/no-image.png'} alt={p.title} style={{width:'100%', borderRadius:8}} />
          </div>
          <div style={{flex:1}}>
            <h1>{p.title}</h1>
            <p style={{fontSize:18, fontWeight:600}}>{p.price} USD</p>
            <p>{p.description}</p>
            {storeSlug ? (
              <a href={`/store/${storeSlug}`}><button style={{padding:'10px 16px', background:'#1976d2', color:'#fff', border:'none', borderRadius:6}}>View merchant store</button></a>
            ) : (
              <a href="/store"><button style={{padding:'10px 16px', background:'#1976d2', color:'#fff', border:'none', borderRadius:6}}>View merchant store</button></a>
            )}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
