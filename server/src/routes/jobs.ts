import { Router, Request, Response, response } from "express";
import { AppDataSource } from "../database";
import { Job } from "../entities/Job";
import { Company } from "../entities/Company";
import { Like } from "typeorm";

const router = Router();

// Retrieve all jobs
router.get("/", async (req, res) => {
  const jobRepository = AppDataSource.getRepository(Job);

  // Retrieve page and limit
  const page = parseInt((req.query.page as any).number as string) || 1;
  const limit = parseInt((req.query.page as any).limit as string) || 10;

  const keyword = (req.query.keyword as string) || "";

  const [jobs, total] = await jobRepository.findAndCount({
    take: limit,
    skip: (page - 1) * limit,
    relations: ["company"],
    order: {
      updated_at: "DESC",
    },
    where: [
      { title: Like(`%${keyword}%`) },
      { company: { title: Like(`%${keyword}%`) } },
    ],
  });

  res.json({
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    jobs: jobs,
  });
});

// GET route for a specific job
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const jobRepository = AppDataSource.getRepository(Job);

  const job = await jobRepository.findOne({
    where: { id: Number(id) },
    relations: ["company"],
  });

  res.json(job);
});

// Create post
router.post("/", async (req, res) => {
  const jobRepository = AppDataSource.getRepository(Job);
  const companyRepository = AppDataSource.getRepository(Company);

  const companyId = req?.body?.companyId;
  const company = await companyRepository.findOne({ where: { id: companyId } });

  const payload = company ? { ...req.body, company } : { ...req.body };
  const job = jobRepository.create(payload);

  await jobRepository.save(job);
  res.json(job);
});

// Update post
router.put("/:id", async (req: Request, res: Response): Promise<any> => {
  const jobId = parseInt(req.params.id);
  const { title, description, expiry, companyId } = req.body;

  const jobRepository = AppDataSource.getRepository(Job);

  try {
    // Find the job by ID
    const job = await jobRepository.findOneBy({ id: jobId });
    const companyRepository = AppDataSource.getRepository(Company);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update job details
    job.title = title;
    job.description = description;
    job.expiry = expiry;

    // Find and set the company
    if (companyId) {
      const company = await companyRepository.findOne({
        where: { id: companyId },
      });
      if (company) {
        job.company = company;
      }
    }

    // Save updated job
    await jobRepository.save(job);

    res.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<any> => {
  const jobId = parseInt(req.params.id);

  const jobRepository = AppDataSource.getRepository(Job);
  try {
    // Find the job by ID
    const job = await jobRepository.delete({ id: jobId });
    return res.json(job);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
