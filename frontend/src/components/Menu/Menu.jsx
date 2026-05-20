import React from 'react';
import { motion } from 'framer-motion';
import './Menu.css';

// ✅ IMPORT LOCAL IMAGES
import img1 from '../../assets/menu/img1.png';
import img2 from '../../assets/menu/img2.png';
import img3 from '../../assets/menu/img3.png';
import img4 from '../../assets/menu/img4.png';
import img5 from '../../assets/menu/img5.png';
import img6 from '../../assets/menu/img6.png';

const menuItems = [
  { id: 1, name: "Black Truffle Tagliatelle", price: "$34", desc: "Fresh hand-cut pasta, winter black truffle, parmigiano reggiano, brown butter emulsion.", img: img1 },
  { id: 2, name: "Dry-Aged Wagyu Ribeye", price: "$78", desc: "45-day dry-aged wagyu, bone marrow jus, roasted heritage carrots, smoked sea salt.", img: img2 },
  { id: 3, name: "Pan-Seared Scallops", price: "$28", desc: "Hokkaido scallops, cauliflower purée, raisin and caper dressing, pancetta crisps.", img: img3 },
  { id: 4, name: "Burrata & Heirloom Tomato", price: "$22", desc: "Creamy puglia burrata, aged balsamic caviar, micro basil, toasted pine nuts.", img: img4 },
  { id: 5, name: "Miso Glazed Black Cod", price: "$42", desc: "Wild-caught cod, sweet saikyo miso, charred bok choy, ginger dashi broth.", img: img5 },
  { id: 6, name: "Dark Chocolate Nemesis", price: "$18", desc: "Flourless chocolate cake, blood orange gel, espresso tuile, vanilla bean ice cream.", img: img6 }
];

const Menu = () => {
  return (
    <section id="menu" className="menu-section">
      <div className="container">
        <div className="menu-header">
          <span className="subtitle">CURATED SELECTION</span>
          <h2>The Seasonal Menu</h2>
          <p>Explore our current tasting selection, featuring the finest ingredients of the season.</p>
        </div>

        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <motion.div 
              key={item.id} 
              className="menu-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="menu-img-wrapper">
                <img src={item.img} alt={item.name} />
              </div>
              <div className="menu-info">
                <div className="menu-title-row">
                  <h3>{item.name}</h3>
                  <span className="price">{item.price}</span>
                </div>
                <p>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;