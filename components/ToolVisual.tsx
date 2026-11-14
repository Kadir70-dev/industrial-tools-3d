'use client';
import { useState } from 'react';
import type { Product } from '@/lib/products';

// Shows the product's studio render; falls back to the code-drawn silhouette if there is none or it fails to load.
export default function ToolVisual({product, large=false}:{product:Product;large?:boolean}) {
 const [failed,setFailed]=useState(false);
 // Static export serves pre-sized WebP renders directly (next/image optimisation is disabled).
 // eslint-disable-next-line @next/next/no-img-element
 if(product.image&&!failed) return <img className={`product-photo${large?' product-photo--large':''}`} src={product.image} alt="" width={1000} height={750} loading={large?'eager':'lazy'} decoding="async" onError={()=>setFailed(true)}/>;
 return <div className={`tool-art tool-art--${product.type}${large?' tool-art--large':''}`} style={{'--tool-tone':product.tone} as React.CSSProperties} aria-hidden="true">
  {product.type==='drill'||product.type==='driver'?<><span className="art-body"/><span className="art-motor"/><span className="art-grip"/><span className="art-battery"/><span className="art-chuck"/><span className="art-bit"/><span className="art-trigger"/></>:null}
  {product.type==='grinder'?<><span className="art-disc"/><span className="art-motor"/><span className="art-handle"/><span className="art-grip"/></>:null}
  {product.type==='saw'?<><span className="art-blade"/><span className="art-body"/><span className="art-grip"/><span className="art-battery"/></>:null}
  {product.type==='hammer'?<><span className="art-hammer-head"/><span className="art-hammer-handle"/></>:null}
  {product.type==='kit'?<><span className="art-case"/><span className="art-case-handle"/><span className="art-kit-tools"/></>:null}
  {product.type==='bits'?<><span className="art-bits-row"/><span className="art-bitcase"/></>:null}
  {product.type==='wrench'?<><span className="art-wrench"/><span className="art-wrench-jaw"/></>:null}
 </div>;
}
