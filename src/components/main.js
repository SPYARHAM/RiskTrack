import React, { useState } from "react";

import {
  TextField,
  IconButton,
  Box,
  Grid,
  Typography,
  Container,
  FormControl,
  Checkbox,
  FormControlLabel,
  Button,
  Snackbar,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import { Delete as DeleteIcon } from "@mui/icons-material";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import MicIcon from "@mui/icons-material/Mic";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import { assets } from "../assets/assets";
import useGemini from "../hooks/useGemini";

const Main = () => {
  const { messages, loadingMessages, sendMessages, updateMessage } =
    useGemini();
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input) return;
    setInput("");
    updateMessage([...messages, { role: "user", parts: [{ text: input }] }]);
    sendMessages({ message: input, history: messages }, input);
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        overflow: "auto",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{ flex: 1, minHeight: "78vh", pb: "15vh", position: "relative" }}
      >
        <Grid container sx={{ display: "flex", justifyContent: "center" }}>
          <Grid item xs={12} md={8}>
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <RenderMessage
                  loading={loadingMessages}
                  key={index + message.role}
                  messageLength={messages.length}
                  message={message}
                  msgIndex={index}
                />
              ))
            ) : (
              <Introduction setInput={setInput} />
            )}
          </Grid>
          <Grid container sx={{ display: "flex", justifyContent: "center" }}>
            <Grid
              item
              md={9}
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "20px",
                  backgroundColor: "#f0f4f9",
                  p: "10px 20px",
                  borderRadius: "20px",
                  marginBottom: "20px",
                }}
              >
                <TextField
                  fullWidth
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  value={input}
                  placeholder="Enter the Prompt Here"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "50px",
                    },
                  }}
                />
                <Box sx={{ display: "flex" }}>
                  <IconButton>
                    <DeleteIcon onClick={() => updateMessage([])} />
                  </IconButton>
                  <IconButton onClick={handleSend}>
                    <SendIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

const Introduction = ({ setInput }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [isExpanded, setIsExpanded] = useState(false);
  const maxWords = 50;

  const truncateText = (text, maxWords) => {
    const words = text.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    projectScope: "",
    startDate: "",
    endDate: "",
    budget: "",
    stakeholders: "",
    technologyTools: "",
    keyResources: "",
    knownConstraints: "",
    potentialChallenges: "",
    risks: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevState) => {
      if (checked) {
        return {
          ...prevState,
          risks: [...prevState.risks, name],
        };
      } else {
        return {
          ...prevState,
          risks: prevState.risks.filter((risk) => risk !== name),
        };
      }
    });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCardClick = (promptText, index) => {
    if (index === 0) {
      const combinedInputLines = [];

      if (promptText.name) {
        combinedInputLines.push(`Project Name: ${promptText.name}`);
      }
      if (promptText.description) {
        combinedInputLines.push(
          `Project Description: ${promptText.description}`
        );
      }
      if (promptText.scope) {
        combinedInputLines.push(`Project Scope: ${promptText.scope}`);
      }
      if (promptText.startDate) {
        combinedInputLines.push(`Start Date: ${promptText.startDate}`);
      }
      if (formData.endDate) {
        combinedInputLines.push(`End Date: ${formData.endDate}`);
      }
      if (formData.budget) {
        combinedInputLines.push(`Budget: ${formData.budget}`);
      }
      if (formData.stakeholders) {
        combinedInputLines.push(`Stakeholders: ${formData.stakeholders}`);
      }
      if (formData.technologyTools) {
        combinedInputLines.push(
          `Technology and Tools: ${formData.technologyTools}`
        );
      }
      if (formData.keyResources) {
        combinedInputLines.push(`Key Resources: ${formData.keyResources}`);
      }
      if (formData.knownConstraints) {
        combinedInputLines.push(
          `Known Constraints: ${formData.knownConstraints}`
        );
      }
      if (formData.potentialChallenges) {
        combinedInputLines.push(
          `Potential Challenges: ${formData.potentialChallenges}`
        );
      }

      combinedInputLines.push(
        "Provide me the risk evaluation of the above project "
      );

      const combinedInput = combinedInputLines.join(" ");

      setInput(combinedInput);
    } else if (index === 1) {
      const formattedInput = `
      Project Name: ${promptText.name}
  
      Project Description: ${promptText.description}
  
      Project Scope (Objectives & Deliverables): ${promptText.scope}
  
      Timeline:
        Start Date: ${promptText.timeline.startDate}
        End Date: ${promptText.timeline.endDate}
        Milestones: ${promptText.timeline.milestones}
  
      Budget:
        Total Budget: ${promptText.budget.total}
        Budget Breakdown: ${promptText.budget.breakdown}
  
      Stakeholders:
        Key Stakeholders: ${promptText.stakeholders}
  
      Technology and Tools:
        Construction Tools: ${promptText.technologyAndTools.constructionTools}
        Software: ${promptText.technologyAndTools.software}
  
      Key Resources:
        Human Resources: ${promptText.keyResources.human}
        Material Resources: ${promptText.keyResources.material}
        Equipment: ${promptText.keyResources.equipment}
  
      Known Constraints:
        Time Constraints: ${promptText.knownConstraints.time}
        Budget Constraints: ${promptText.knownConstraints.budget}
        Regulatory Constraints: ${promptText.knownConstraints.regulatory}
  
      Potential Challenges:
        Environmental Impact: ${promptText.potentialChallenges.environmentalImpact}
        Land Acquisition: ${promptText.potentialChallenges.landAcquisition}
        Construction Delays: ${promptText.potentialChallenges.constructionDelays}
   
    `;

      setInput(formattedInput);
    } else {
      const formattedInput = `
      Project Name: ${promptText.name}
  
      Project Description: ${promptText.description}
  
      Project Scope (Objectives & Deliverables): ${promptText.scope}
  
      Timeline:
        Start Date: ${promptText.timeline.startDate}
        End Date: ${promptText.timeline.endDate}
        Milestones: ${promptText.timeline.milestones}
  
      Budget:
        Total Budget: ${promptText.budget.total}
        Budget Breakdown: ${promptText.budget.breakdown}
  
      Stakeholders:
        Key Stakeholders: ${promptText.stakeholders}
  
      Technology and Tools:
        Construction Tools: ${promptText.technologyAndTools.constructionTools}
        Software: ${promptText.technologyAndTools.software}
  
      Key Resources:
        Human Resources: ${promptText.keyResources.human}
        Material Resources: ${promptText.keyResources.material}
        Equipment: ${promptText.keyResources.equipment}
  
      Known Constraints:
        Time Constraints: ${promptText.knownConstraints.time}
        Budget Constraints: ${promptText.knownConstraints.budget}
        Regulatory Constraints: ${promptText.knownConstraints.regulatory}
  
      Potential Challenges:
        Environmental Impact: ${promptText.potentialChallenges.environmentalImpact}
        Land Acquisition: ${promptText.potentialChallenges.landAcquisition}
        Construction Delays: ${promptText.potentialChallenges.constructionDelays}
      
  
    
    `;

      setInput(formattedInput);
    }

    console.log(index, "prompt");
  };
  const itemList = [
    {
      name: "Highway Expansion",
      description:
        "This project involves the expansion of an existing highway to accommodate increased traffic volume. The goal is to reduce congestion and improve travel efficiency.",
      scope:
        "Expand the highway from 4 to 6 lanes, improve safety features, and enhance road signage.",
      timeline: {
        startDate: "January 15, 2024",
        endDate: "December 30, 2025",
      },
      budget: {
        total: "$50 million",
      },
      stakeholders:
        "Department of Transportation, local government, construction contractors, and local communities.",
      technologyAndTools: {
        constructionTools: "Excavators, graders, pavers, and compactors.",
        software:
          "AutoCAD for design, Primavera for project management, and ArcGIS for environmental assessment.",
      },
      keyResources: {
        human:
          "Project managers, civil engineers, construction workers, and safety inspectors.",
        material: "Asphalt, steel reinforcements, drainage materials.",
        equipment: "Bulldozers, cranes, and asphalt mixers.",
      },
      knownConstraints: {
        time: "Potential delays due to weather conditions.",
        budget: "Risk of cost overruns due to fluctuating material prices.",
        regulatory:
          "Compliance with environmental regulations and obtaining necessary permits.",
      },
      potentialChallenges: {
        environmentalImpact:
          "Possible impact on local wildlife and vegetation.",
        landAcquisition:
          "Challenges in acquiring additional land for expansion.",
        constructionDelays:
          "Risks of delays from adverse weather or supply chain disruptions.",
      },
    },
    {
      name: "Urban Road Redevelopment",
      description:
        "Redeveloping a central urban road to improve traffic flow, incorporate bike lanes, and enhance pedestrian safety. The project aims to revitalize the urban area and support local businesses.",
      scope:
        "Upgrade road infrastructure, add bike lanes, and improve pedestrian crossings.",
      timeline: {
        startDate: "March 1, 2024",
        endDate: "November 30, 2024",
      },
      budget: {
        total: "$20 million",
      },
      stakeholders:
        "City Council, urban planning department, local business owners, and residents.",
      technologyAndTools: {
        constructionTools:
          "Road rollers, paving machines, and concrete mixers.",
        software:
          "Civil 3D for road design, MS Project for scheduling, and GIS for spatial analysis.",
      },
      keyResources: {
        human:
          "Urban planners, civil engineers, project coordinators, and construction crews.",
        material: "Concrete, asphalt, road signage.",
        equipment: "Excavators, loaders, and traffic control equipment.",
      },
      knownConstraints: {
        time: "Tight schedule due to urban setting and need to minimize disruptions.",
        budget: "Limited budget with high community expectations.",
      },
      potentialChallenges: {
        environmentalImpact: "Limited green space due to urban density.",
        landAcquisition:
          "Minimizing impact on existing businesses and properties.",
        constructionDelays:
          "Potential for delays from unforeseen underground utilities.",
      },
    },
    {
      name: "Rural Road Improvement",
      description:
        "Improvement of a rural road to enhance connectivity and safety for local communities. The project focuses on upgrading road surfaces and adding safety features.",
      scope: "Upgrade road surface, add safety signage, and improve drainage.",
      timeline: {
        startDate: "June 1, 2024",
        endDate: "September 30, 2024",
      },
      budget: {
        total: "$10 million",
      },
      stakeholders:
        "Rural development authority, local government, community leaders, and construction firms.",
      technologyAndTools: {
        constructionTools: "Road graders, compactors, and dump trucks.",
        software: "Road design software and project management tools.",
      },
      keyResources: {
        human: "Road engineers, project managers, construction workers.",
        material: "Road base materials, asphalt.",
        equipment: "Pavers, graders, and rollers.",
      },
      knownConstraints: {
        time: "Short construction window due to seasonal weather conditions.",
        budget: "Limited budget with high expectations for quality.",
      },
      potentialChallenges: {
        environmentalImpact: "Limited green space due to urban density.",
        landAcquisition:
          "Limited land availability and potential land use conflicts.",
        constructionDelays:
          "Risk of delays from weather and supply chain issues.",
      },
    },
  ];

  const cardsData = [
    {
      key: "Step-1",
      title: "Project Details Input",
      description:
        "The user begins by providing detailed information about their project, such as the scope, timeline, budget, and other specifics. They can also select which types of risks they want to evaluate (e.g., financial, operational, technical).",
      gradientClass: "linear-gradient(71deg, #0d1212, #3da077, #0d1212)",
    },
    {
      key: "Step-2",
      title: "Risk Evaluation & Insights",
      description:
        "After submitting the project details, the model analyzes the provided information and generates a detailed risk assessment. The user can then review these insights and engage in further conversation with the model to explore specific risks or mitigation strategies.",
      gradientClass: "linear-gradient(71deg, #0d1212, #3da077, #0d1212)",
    },
  ];
  return (
    <>
      <Box
        sx={{
          mt: 5,
          mb: 5,
          fontSize: "56px",
          color: "#c4c7c5",
          fontWeight: "500",
        }}
      >
        <Typography
          variant="h3"
          component="p"
          sx={{ fontWeight: "500", color: "#c4c7c5" }}
        >
          <Box
            component="span"
            sx={{
              background: "linear-gradient(16deg,#4b90ff,#ff5546)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Hello, User
          </Box>
        </Typography>
        <Typography variant="h5" component="p">
          Welcome to RiskTrack
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 1,
          mb: 2,

          color: "black",
          fontWeight: "500",
        }}
      >
        <Typography
          variant="h5"
          component="p"
          sx={{ fontFamily: "Times New Roman" }}
        >
          How this works:
        </Typography>
      </Box>
      <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
        {cardsData.map((card, index) => (
          <GradientCard
            key={index}
            heading={card.key}
            title={card.title}
            description={card.description}
            gradientClass={card.gradientClass}
          />
        ))}
      </Grid>
      <Box
        sx={{
          mt: 1,
          mb: 2,
          fontSize: "20px",
          color: "black",
          fontWeight: "500",
        }}
      >
        <Typography component="p" sx={{ fontFamily: "Times New Roman" }}>
          Fill the form details :
        </Typography>
      </Box>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}
      >
        <Grid item xs={12} sm={9} md={8}>
          <Box sx={{ p: 4, backgroundColor: "#f9f9f9", borderRadius: "15px" }}>
            <Typography variant="h4" sx={{ mb: 4, color: "#333" }}>
              Project Risk Evaluation Form
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Name"
                  variant="outlined"
                  required
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Description"
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Project Scope (Objectives & Deliverables)"
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                  name="projectScope"
                  value={formData.projectScope}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  required
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Budget (in USD)"
                  type="number"
                  variant="outlined"
                  required
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Key Stakeholders"
                  variant="outlined"
                  required
                  name="stakeholders"
                  value={formData.stakeholders}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Technology and Tools"
                  variant="outlined"
                  required
                  name="technologyTools"
                  value={formData.technologyTools}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Key Resources (e.g., human, material)"
                  variant="outlined"
                  required
                  name="keyResources"
                  value={formData.keyResources}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Known Constraints (e.g., time, budget)"
                  variant="outlined"
                  required
                  name="knownConstraints"
                  value={formData.knownConstraints}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Potential Challenges"
                  multiline
                  rows={4}
                  variant="outlined"
                  required
                  name="potentialChallenges"
                  value={formData.potentialChallenges}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSubmit}
                >
                  Submit for Risk Evaluation
                </Button>
              </Grid>
            </Grid>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
            />
          </Box>
        </Grid>
      </Grid>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography sx={{ fontSize: "18px", fontFamily: "Times New Roman" }}>
            No inspiration? Click on the prompt cards below :{" "}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            marginBottom: 2,
          }}
        ></Box>
      </Box>

      <Grid container spacing={2}>
        {itemList.map((item, index) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  height: isExpanded ? "auto" : "200px",
                  p: "15px",
                  backgroundColor: "#f0f4f9",
                  borderRadius: "10px",
                  position: "relative",
                  cursor: "pointer",
                  overflow: "hidden",
                  "&:hover": {
                    backgroundColor: "#dfe4ea",
                  },
                }}
                onClick={() => {
                  handleCardClick(item, index);
                }}
              >
                <Typography
                  sx={{
                    color: "#585858",
                    fontSize: "17px",
                    fontWeight: "bold",
                  }}
                >
                  {item.name}
                </Typography>

                <Typography sx={{ color: "#585858", fontSize: "14px", mb: 2 }}>
                  {item.description}
                </Typography>

                {isExpanded && (
                  <>
                    <Typography sx={{ fontWeight: "bold" }}>Scope:</Typography>
                    <Typography sx={{ mb: 2 }}>{item.scope}</Typography>

                    <Typography sx={{ fontWeight: "bold" }}>
                      Timeline:
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      Start Date: {item.timeline.startDate}
                      <br />
                      End Date: {item.timeline.endDate}
                      <br />
                    </Typography>

                    <Typography sx={{ fontWeight: "bold" }}>Budget:</Typography>
                    <Typography sx={{ mb: 2 }}>
                      Total: {item.budget.total}
                      <br />
                    </Typography>

                    <Typography sx={{ fontWeight: "bold" }}>
                      Stakeholders:
                    </Typography>
                    <Typography sx={{ mb: 2 }}>{item.stakeholders}</Typography>

                    <Typography sx={{ fontWeight: "bold" }}>
                      Technology & Tools:
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      Construction Tools:{" "}
                      {item.technologyAndTools.constructionTools}
                      <br />
                      Software: {item.technologyAndTools.software}
                    </Typography>

                    <Typography sx={{ fontWeight: "bold" }}>
                      Key Resources:
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      Human: {item.keyResources.human}
                      <br />
                      Material: {item.keyResources.material}
                      <br />
                      Equipment: {item.keyResources.equipment}
                    </Typography>

                    <Typography sx={{ fontWeight: "bold" }}>
                      Known Constraints:
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      Time: {item.knownConstraints.time}
                      <br />
                      Budget: {item.knownConstraints.budget}
                      <br />
                    </Typography>

                    <Typography sx={{ fontWeight: "bold" }}>
                      Potential Challenges:
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                      Environmental Impact:{" "}
                      {item.potentialChallenges.environmentalImpact}
                      <br />
                      Land Acquisition:{" "}
                      {item.potentialChallenges.landAcquisition}
                      <br />
                      Construction Delays:{" "}
                      {item.potentialChallenges.constructionDelays}
                      <br />
                    </Typography>
                  </>
                )}

                <Button
                  onClick={() => setIsExpanded(!isExpanded)}
                  sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    fontSize: "12px",
                  }}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </Button>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

const GradientCard = ({ heading, title, description }) => {
  return (
    <Grid item xs={12} sm={6} md={6}>
      <Box
        sx={{
          p: 3,
          borderRadius: "15px",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          background: "#1e1e2f",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.05)",
            "&::before": {
              background:
                "linear-gradient(45deg, #ff6ec4, #7873f5, #42a5f5, #6a82fb)",
              animation: "moveGradient 4s linear infinite",
            },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            background:
              "linear-gradient(45deg, #42a5f5, #6a82fb, #ff6ec4, #7873f5)",
            zIndex: "-1",
            backgroundSize: "400% 400%",
            animation: "moveGradient 8s linear infinite",
            borderRadius: "inherit",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "#1e1e2f",
            borderRadius: "inherit",
            zIndex: "0",
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: 700,
            fontSize: "24px",
            fontFamily: '"Poppins", sans-serif',
            zIndex: 1,
            position: "relative",
          }}
        >
          {heading}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: 700,
            marginTop: "10px",
            fontSize: "24px",
            fontFamily: '"Poppins", sans-serif',
            zIndex: 1,
            position: "relative",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "#dcdde1",
            fontWeight: 500,
            fontSize: "16px",
            lineHeight: "1.6",
            fontFamily: '"Poppins", sans-serif',
            marginTop: "10px",
            zIndex: 1,
            position: "relative",
          }}
        >
          {description}
        </Typography>
      </Box>
    </Grid>
  );
};

const RenderMessage = ({ message, msgIndex, loading, messageLength }) => {
  const loadingStyles = {
    width: "50%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };

  const shimmerStyles = {
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#f6f7f8",
    background: "linear-gradient(to right, #b1d5ee, #c953e98a, #9ed7ff)",
    backgroundSize: "800px 50px",
    height: "20px",
    animation: "loader 4s infinite linear",
  };

  const keyframes = {
    "@keyframes loader": {
      "0%": {
        backgroundPosition: "-800px 0px",
      },
      "100%": {
        backgroundPosition: "800px 0px",
      },
    },
  };

  const { parts, role } = message;

  const Loader = () =>
    msgIndex === messageLength - 1 &&
    loading && (
      <Box sx={loadingStyles}>
        <Box
          sx={{
            ...shimmerStyles,

            "@keyframes loader": keyframes["@keyframes loader"],
          }}
        />
        <Box
          sx={{
            ...shimmerStyles,

            "@keyframes loader": keyframes["@keyframes loader"],
          }}
        />
        <Box
          sx={{
            ...shimmerStyles,

            "@keyframes loader": keyframes["@keyframes loader"],
          }}
        />
      </Box>
    );

  return parts.map((part, index) =>
    part.text ? (
      <Box key={index} display={"flex"} alignItems={"flex-start"}>
        {role === "user" ? (
          <Box
            component="img"
            src={assets.user}
            alt="User"
            sx={{
              width: "40px",
              height: "40px",
              marginRight: "8px",
              marginY: "20px",
              borderRadius: "50%",
            }}
          />
        ) : (
          <Box
            component="img"
            src={assets.gemini_icon}
            alt="Gemini"
            sx={{
              width: "40px",
              height: "40px",
              marginRight: "8px",
              marginY: "8px",
            }}
          />
        )}
        <Box
          as={motion.div}
          sx={{
            maxWidth: { xs: "80%", md: "90%" },
            width: "fit-content",
            whiteSpace: "normal",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
            alignSelf: role === "user" ? "flex-end" : "flex-start",
            marginY: role === "user" ? "20px" : "8px",
            padding: "8px 16px 8px 22px",
            borderRadius: "8px",
            // backgroundColor: role === "user" ? "#EE4E4E" : "#BEADFA",
            background:
              role === "user"
                ? "black"
                : "linear-gradient(to right, #6A82FB, #FC5C7D)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color:
              role === "user"
                ? "black"
                : "linear-gradient(to right, #43E97B, #38F9D7)",
            opacity: 0,
            fontSize: role === "user" ? "18px" : "16px",
            lineHeight: "28px",
            transform: "scale(0.5) translateY(20px)",
          }}
          animate={{ opacity: 1, transform: "scale(1) translateY(0)" }}
        >
          <ReactMarkdown
            key={index + part.text}
            components={{
              p: ({ node, ...props }) => (
                <Typography
                  {...props}
                  sx={{
                    fontSize: "16px",
                    lineHeight: { xs: "28px", md: "24px" },
                  }}
                />
              ),
              code: ({ node, ...props }) => (
                <pre
                  {...props}
                  sx={{
                    fontFamily: "Times New Roman",
                    color: "white",
                    backgroundColor: "#424242",
                    borderRadius: "8px",
                    padding: "12px",
                    overflow: "auto",
                    margin: "8px",
                  }}
                />
              ),
            }}
          >
            {part.text}
          </ReactMarkdown>
        </Box>
        <Loader />
      </Box>
    ) : (
      <Loader key={index + part.text} />
    )
  );
};

RenderMessage.propTypes = {
  message: PropTypes.object.isRequired,
  msgIndex: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  messageLength: PropTypes.number.isRequired,
};

export default Main;
