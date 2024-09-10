import { useEffect, useState } from "react";
import GeminiService from "../config/Gemini";

export default function useGemini() {
  const [messages, updateMessage] = useState(checkForMessages());
  const [loadingMessages, setLoadingMessages] = useState(false);

  function checkForMessages() {
    const savedMessages = localStorage.getItem("messages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  }

  useEffect(() => {
    const saveMessages = () =>
      localStorage.setItem("messages", JSON.stringify(messages));
    window.addEventListener("beforeunload", saveMessages);
    return () => window.removeEventListener("beforeunload", saveMessages);
  }, [messages]);
  const sendMessages = async (payload, input) => {
    updateMessage((prevMessages) => [
      ...prevMessages,
      { role: "model", parts: [{ text: "" }] },
    ]);
    setLoadingMessages(true);
    console.log(payload, "payload");
    console.log(input, "input");

    try {
      const requiredFields = [
        "Project Name",
        "Project Description",
        "Project Scope",
        "Start Date",
        "End Date",
        "Budget",
        "Key Stakeholders",
        "Technology and Tools",
        "Key Resources",
        "Known Constraints",
        "Potential Challenges",
      ];

      const allFieldsPresent = requiredFields.every((field) =>
        input.includes(field)
      );

      let customPrompt;

      if (allFieldsPresent) {
        customPrompt = `
          You are a project risk management expert tasked with evaluating the potential risks associated with a major infrastructure project. Below are the project details:
          project: ${input}
  
          **Your Task:**
          1. **In-depth Risk Analysis**:
             - **Risk Identification**: Identify and describe the specific internal and external risks, with a focus on Financial, Operational, and Regulatory risks. Please consider nuanced risks like market volatility affecting material costs or potential political changes that could impact regulations.
             - **Risk Mitigation Strategies**: Suggest practical and innovative strategies to avoid, reduce, transfer, or accept each identified risk. Highlight any industry best practices or advanced techniques that could be particularly effective.
  
          2. **Feasibility Analysis**:
             - **Technical Feasibility**: Assess the technology stack and tools. Identify any potential risks in software integration, equipment availability, or construction methodology. Suggest improvements or alternatives if necessary.
             - **Economic Feasibility**: Perform a comprehensive cost-benefit analysis. Include considerations for long-term economic benefits such as increased property values and business revenues due to improved infrastructure. Assess the ROI and break-even points, especially considering the potential for unforeseen expenses.
             - **Operational Feasibility**: Evaluate the project’s operational readiness. Assess the availability and capability of resources, and suggest ways to enhance efficiency, such as cross-training personnel or optimizing logistics.
             - **Schedule Feasibility**: Scrutinize the proposed timeline. Identify potential bottlenecks, and suggest realistic timelines with built-in contingencies. Provide a phased approach if it can help mitigate risks.
             - **Legal and Regulatory Feasibility**: Examine compliance with all relevant regulations. Provide insights into any potential legal challenges or delays, especially regarding environmental impact assessments. Suggest preemptive actions to ensure smooth compliance.
  
          3. **Advanced Decision-Making Criteria**:
             - **Alignment with Strategic Goals**: Discuss how the project fits into broader urban planning and economic development goals. Assess the potential long-term benefits versus short-term risks.
             - **Financial Viability**: Beyond the basic cost analysis, explore alternative funding sources or cost-sharing opportunities that could enhance financial viability.
             - **Risk Tolerance**: Discuss the city's risk tolerance, and how it aligns with the risk profile of this project. Suggest adjustments to the project scope or approach if necessary.
             - **Resource Availability**: Provide a detailed resource availability analysis, including human, material, and technological resources. Suggest potential outsourcing or partnerships to address gaps.
             - **Stakeholder Support**: Assess the level of stakeholder engagement and suggest ways to enhance support through better communication strategies or stakeholder involvement in decision-making.
             - **Market Demand**: Analyze the current and future demand for improved infrastructure in this urban area, considering population growth trends, urbanization rates, and economic development plans.
  
          4. **Utilize Advanced Tools and Techniques**:
             - **SWOT Analysis**: Provide a detailed SWOT analysis, focusing on the specific strengths, weaknesses, opportunities, and threats related to this project.
             - **PESTLE Analysis**: Offer a PESTLE analysis with a focus on how political, economic, and environmental factors could specifically impact this project.
             - **Monte Carlo Simulation**: Use statistical modeling to provide a more accurate risk assessment. Include a discussion on how different risk factors could interact and compound.
             - **Scenario Planning**: Develop multiple scenarios (best case, worst case, most likely) and provide a detailed analysis of each. Suggest contingency plans for each scenario.
  
          5. **Final Decision Recommendation**:
             - Provide a nuanced final decision based on the comprehensive risk assessment and feasibility analysis. Include a clear rationale for proceeding, delaying, or canceling the project. If recommending proceeding, suggest specific conditions or prerequisites that should be met.
        `;
      } else if (input.toLowerCase().includes("e-commerce")) {
        customPrompt = `
          You are a project risk management expert tasked with evaluating the potential risks associated with an e-commerce project. The project involves setting up an online platform for retail sales.
  
          **Your Task:**
          1. **Identify Key Risks**:
             - **Market Risks**: Consider the competitive landscape, potential market saturation, and consumer behavior.
             - **Technical Risks**: Assess risks related to website performance, cybersecurity, and scalability.
             - **Operational Risks**: Evaluate potential issues in supply chain management, logistics, and customer service.
             - **Financial Risks**: Analyze the financial viability, including the costs of marketing, technology, and fulfillment.
  
          2. **Provide Risk Mitigation Strategies**:
             - **Technical Solutions**: Suggest strategies to ensure website reliability, such as cloud hosting, cybersecurity measures, and performance optimization.
             - **Market Adaptation**: Recommend approaches to stay competitive, like market research, dynamic pricing, and customer engagement strategies.
             - **Operational Efficiency**: Propose ways to streamline operations, improve logistics, and enhance customer service.
  
          3. **Basic Feasibility Analysis**:
             - **Budget Considerations**: Provide a high-level budget analysis, focusing on key cost areas like technology, marketing, and operations.
             - **Timeline Feasibility**: Offer a basic timeline, with suggestions for phases and milestones.
          `;
      } else if (input.toLowerCase().includes("construction")) {
        customPrompt = `
          You are a project risk management expert tasked with evaluating the potential risks associated with a construction project.
  
          **Your Task:**
          1. **Identify Key Risks**:
             - **Construction Delays**: Analyze potential causes of delays, such as weather, supply chain issues, and labor shortages.
             - **Cost Overruns**: Assess risks related to budget overruns due to material costs, design changes, or unforeseen site conditions.
             - **Safety Risks**: Identify safety hazards and compliance with safety regulations.
  
          2. **Provide Risk Mitigation Strategies**:
             - **Schedule Management**: Suggest strategies to manage and mitigate delays, including contingency planning and efficient resource allocation.
             - **Cost Control**: Recommend cost-saving measures, such as value engineering and tight contract management.
             - **Safety Protocols**: Propose safety measures and compliance strategies to minimize risk on-site.
  
          3. **Basic Feasibility Analysis**:
             - **Resource Allocation**: Provide a basic analysis of the availability of materials and labor.
             - **Regulatory Compliance**: Offer a basic review of regulatory requirements and potential challenges.
          `;
      } else if (input.toLowerCase().includes("software")) {
        customPrompt = `
          You are a project risk management expert tasked with evaluating the potential risks associated with a software development project.
  
          **Your Task:**
          1. **Identify Key Risks**:
             - **Technical Risks**: Assess risks related to software bugs, integration issues, and scalability.
             - **Timeline Risks**: Evaluate risks associated with project timelines, including feature creep and development delays.
             - **Resource Risks**: Analyze potential challenges in resource availability, such as developer shortages or skill gaps.
  
          2. **Provide Risk Mitigation Strategies**:
             - **Agile Development**: Suggest agile methodologies to manage and mitigate technical and timeline risks.
             - **Testing Protocols**: Recommend thorough testing strategies, including automated testing and continuous integration.
             - **Resource Management**: Propose strategies for ensuring resource availability, such as outsourcing or hiring contractors.
  
          3. **Basic Feasibility Analysis**:
             - **Timeline Feasibility**: Provide a basic analysis of the project timeline, with suggestions for iterative development and milestone planning.
             - **Budget Considerations**: Offer a high-level budget overview, focusing on key cost drivers like development, testing, and deployment.
          `;
      } else if (input.toLowerCase().includes("healthcare")) {
        customPrompt = `
          You are a project risk management expert tasked with evaluating the potential risks associated with a healthcare infrastructure project.
  
          **Your Task:**
          1. **Identify Key Risks**:
             - **Regulatory Compliance**: Assess risks related to healthcare regulations, patient data protection, and licensing.
             - **Operational Risks**: Evaluate risks in staffing, equipment availability, and patient care.
             - **Financial Risks**: Analyze the financial viability, considering the high costs of medical equipment and facilities.
  
          2. **Provide Risk Mitigation Strategies**:
             - **Compliance Measures**: Suggest strategies to ensure compliance with healthcare regulations, such as regular audits and staff training.
             - **Operational Efficiency**: Recommend ways to improve operational efficiency, like optimizing patient flow and resource allocation.
             - **Cost Management**: Propose cost-saving measures, such as bulk purchasing of equipment and efficient facility design.
  
          3. **Basic Feasibility Analysis**:
             - **Resource Availability**: Provide a basic analysis of the availability of medical staff and equipment.
             - **Timeline Feasibility**: Offer a basic timeline, with suggestions for phases and milestones.
          `;
      } else if (input.toLowerCase().includes("education")) {
        customPrompt = `
          You are a project risk management expert tasked with evaluating the potential risks associated with an educational infrastructure project.
  
          **Your Task:**
          1. **Identify Key Risks**:
             - **Regulatory Compliance**: Assess risks related to educational regulations, accreditation, and curriculum standards.
             - **Operational Risks**: Evaluate risks in staffing, student enrollment, and facility management.
             - **Financial Risks**: Analyze the financial viability, considering funding sources, operational costs, and sustainability.
  
          2. **Provide Risk Mitigation Strategies**:
             - **Compliance Measures**: Suggest strategies to ensure compliance with educational regulations and accreditation standards.
             - **Operational Efficiency**: Recommend ways to improve operational efficiency, like optimizing resource allocation and enhancing staff training.
             - **Cost Management**: Propose cost-saving measures, such as shared resources and energy-efficient facility designs.
  
          3. **Basic Feasibility Analysis**:
             - **Resource Availability**: Provide a basic analysis of the availability of educational resources and staff.
             - **Timeline Feasibility**: Offer a basic timeline, with suggestions for phases and milestones.
          `;
      } else {
        customPrompt = `
          You are a project risk management expert. The user has provided limited details about the project.
  
          **Your Task:**
          1. **General Risk Assessment**:
             - Identify common risks associated with typical projects.
             - Provide general strategies for mitigating these risks.
  
          2. **Request More Information**:
             - Ask the user for more specific details to provide a more tailored risk assessment.
          `;
      }

      const stream = await GeminiService.sendMessages(
        customPrompt,
        payload.history
      );

      setLoadingMessages(false);

      for await (const chunk of stream) {
        const chunkText = chunk.text();
        updateMessage((prevMessages) => {
          const prevMessageClone = structuredClone(prevMessages);
          prevMessageClone[prevMessages.length - 1].parts[0].text += chunkText;
          return prevMessageClone;
        });
      }
    } catch (error) {
      updateMessage([
        ...messages,
        {
          role: "model",
          parts: [
            {
              text: "Seems like I'm having trouble connecting to the server. Please try again later.",
            },
          ],
        },
      ]);
      console.error("An error occurred:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  return { messages, loadingMessages, sendMessages, updateMessage };
}
