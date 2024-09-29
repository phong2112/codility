import { Router, Request, Response } from "express";
import { AppDataSource } from "../database";
import { Company } from "../entities/Company";

const router = Router();

// Retrieve all companies
router.get("/", async (req, res) => {
  const companyRepository = AppDataSource.getRepository(Company);

  // Retrieve page and limit
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 1000;

  const [companies, total] = await companyRepository.findAndCount({
    take: limit,
    skip: (page - 1) * limit,
  });

  res.json({
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    companies: companies,
  });
});

// GET route for a specific company
router.get("/:id", (req, res) => {
  //   const userId = req.params.id;
  //   res.send(`User ID: ${userId}`);
});

// Create company
router.post("/", async (req, res) => {
  const companyRepository = AppDataSource.getRepository(Company);
  const company = companyRepository.create(req.body);
  await companyRepository.save(company);
  res.json(company);
});

export default router;
