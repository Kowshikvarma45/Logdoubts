"use client"
// export const Image = ()=>{
//     return (
//         <div>
//             <img src="../public/jumbopng.png" alt="chatapppng" />
//         </div>
//     )
// }
import Image from 'next/image';

export const Images = ()=>{
  return (
    <Image
      src="/path/to/image.png"
      alt="Description"
      width={500}
      height={300}
    />
  );
}