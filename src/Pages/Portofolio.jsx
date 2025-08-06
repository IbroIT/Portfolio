import React, { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import { Code, Boxes } from "lucide-react";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "Свернуть" : "Подробнее"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "git.svg", language: "Git" },
  { icon: "python.svg", language: "Python" },
  { icon: "figma.svg", language: "Figma" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "photoshop.svg", language: "Photoshop" },
];

const dordoiAssociationProject = {
  id: "dordoi-association",
  Img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  Title: "Сайт для Ассоциации Дордой (В разработке)",
  Description: "Официальный веб-сайт Ассоциации Дордой с информацией о деятельности, членах и услугах. Включает административную панель для управления контентом.",
  Link: "https://dordoi-eta.vercel.app",
  TechStack: ["React", "Tailwind CSS", "Firebase", "Material UI"],
  features: [
    "Адаптивный дизайн для всех устройств",
    "Система управления контентом",
    "Новости, мероприятия и события",
    "Контакты и обратная связь"
  ]
};

const fcDordoiProject = {
  id: "fc-dordoi",
  Img: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1293&q=80",
  Title: "ФК Дордой (В разработке)",
  Description: "Официальный сайт футбольного клуба Дордой с расписанием матчей, статистикой игроков и новостями команды.",
  Link: "https://fc-dordoi.vercel.app/",
  TechStack: ["React", "Next.js", "Tailwind CSS", "Firebase"],
  features: [
    "Расписание матчей и результаты",
    "Профили игроков с статистикой",
    "Новости и анонсы",
    "Галерея с фото и видео",
    "Мобильная версия"
  ]
};
const tagroup = {
  id: "ta-group",
  Img: "/image.png",
  Title: "TradeAdvisor - инвестиционный консалтинговый сайт",
  Description: "Современный веб-сайт для финансовой компании, предоставляющей консультационные и аналитические услуги на рынках США. Проект выполнен с фокусом на удобство, безопасность и соответствие юридическим требованиям. В основе — автоматизация, аналитика, AI-модели и прозрачный подход к консультированию инвесторов.",
  Link: "https://tradesadvisor.ai",
  TechStack: ["React", "Django", "Tailwind CSS", "PostgreSQL"],
  features: [
    "Мультиплатформенность",
    "Гибкие тарифные планы",
    "Мультиязычность"
  ]
};

// Updated CardProject component with improved styling
const CardProject = ({ Img, Title, Description, Link, features }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
  className="relative h-full flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-[#0f172a] transition-all duration-500 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 group"
>
  {/* Image container with hover effect */}
  <div className="relative overflow-hidden h-48">
    <img
      src={Img}
      alt={Title}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    {/* Tech stack badges floating on hover */}
    <div className="absolute top-3 left-3 flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      {features.slice(0, 3).map((feature, index) => (
        <span 
          key={index}
          className="px-2 py-1 bg-black/70 backdrop-blur text-xs text-white rounded-md border border-white/10"
        >
          {feature}
        </span>
      ))}
    </div>
  </div>
  
  {/* Content container */}
  <div className="p-5 flex-1 flex flex-col">
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-xl font-bold text-white">{Title}</h3>
      <span className="inline-flex items-center px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/20">
       
      </span>
    </div>
    
    <p className="text-slate-300 text-sm mb-4 flex-1">{Description}</p>
    
    {/* Features with animated checkmarks */}
    {features && features.length > 0 && (
      <div className="mb-4">
        <ul className="space-y-2">
          {features.slice(0, 3).map((feature, index) => (
            <li 
              key={index}
              className="flex items-start group/feature"
            >
              <div className="relative mt-0.5 mr-2">
                <div className="w-4 h-4 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <svg 
                    className="w-3 h-3 text-purple-400 opacity-0 group-hover/feature:opacity-100 transition-opacity duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              <span className="text-slate-300 text-xs">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {/* Footer with animated button */}
    <div className="mt-auto pt-4 border-t border-white/5">
      <a
        href={Link}
        target="_blank"
        rel="noopener noreferrer"
        className="
          relative inline-flex items-center justify-center 
          px-4 py-2 w-full
          text-white text-sm font-medium rounded-lg
          overflow-hidden
          transition-all duration-300
          bg-gradient-to-r from-purple-600 to-blue-600
          hover:from-purple-500 hover:to-blue-500
          hover:shadow-lg hover:shadow-purple-500/20
          group/button
        "
      >
        <span className="relative z-10 flex items-center">
          Открыть проект
          <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/button:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300"></span>
      </a>
    </div>
  </div>
  
  {/* Glow effect on hover */}
  <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
    <div className="absolute -inset-px bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-2xl blur-sm"></div>
  </div>
</div>
  );
};

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const projectCollection = collection(db, "projects");
      const projectSnapshot = await getDocs(projectCollection);

      const projectData = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        TechStack: doc.data().TechStack || [],
      }));

      setProjects(projectData);
      localStorage.setItem("projects", JSON.stringify(projectData));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback(() => {
    setShowAllProjects(prev => !prev);
  }, []);

  // Combine Firebase projects with the custom projects
  const allProjects = [dordoiAssociationProject, fcDordoiProject, tagroup,];
  const displayedProjects = showAllProjects ? allProjects : allProjects.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Витрина портфолио
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Мои проекты в веб-разработке, включая официальный сайт Ассоциации Дордой.
          Каждый проект демонстрирует мой профессиональный подход и технические навыки.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Проекты"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Технологии"
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                    className="h-full"
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      features={project.features}
                    />
                  </div>
                ))}
              </div>
            </div>
            {allProjects.length > initialItems && (
              <div className="mt-10 w-full flex justify-center">
                <ToggleButton
                  onClick={toggleShowMore}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
}