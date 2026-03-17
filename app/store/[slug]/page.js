import React from 'react';
import DashboardLayout from '@/layout/DashboardLayout';

export async function generateMetadata({ params }) {
  const slug = params.slug;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  try {
    const res = await fetch(`${base}/merchants/by-slug/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (!res.ok) return { title: `${slug} - Store` };
    const merchant = await res.json();
    return {
      title: merchant.shop_name,
      description: merchant.description || `Shop ${merchant.shop_name} on Alia`,
      openGraph: {
        title: merchant.shop_name,
        description: merchant.description || '',
        images: merchant.products && merchant.products[0] && merchant.products[0].images.length ? merchant.products[0].images[0] : undefined
      }
    };
  } catch (e) {
    return { title: `${slug} - Store` };
  }
}

export default async function StorePage({ params }) {
  const slug = params.slug;
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const res = await fetch(`${base}/merchants/by-slug/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (!res.ok) return <DashboardLayout><div style={{padding:20}}>Store not found</div></DashboardLayout>;
  const merchant = await res.json();

  return (
    <DashboardLayout>
      <div style={{maxWidth:960, margin:'0 auto', padding:20}}>
        <h1>{merchant.shop_name}</h1>
        <p>{merchant.description}</p>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12}}>
          {merchant.products.map((p) => (
            <a key={p.id} href={`/product/${p.id}`} style={{textDecoration:'none', color:'inherit'}}>
              <div style={{border:'1px solid #eee', borderRadius:8, padding:8}}>
                <img src={p.images && p.images[0] ? p.images[0] : '/no-image.png'} alt={p.title} style={{width:'100%', height:160, objectFit:'cover', borderRadius:6}} />
                <h3 style={{margin:'8px 0 4px'}}>{p.title}</h3>
                <div style={{color:'#2b2b2b', fontWeight:600}}>{p.price} USD</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
