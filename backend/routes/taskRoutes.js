const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middelware/authMiddleware");

const router = express.Router();

// Create Task API
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;

        // Check title
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        // Create task
        const task = await Task.create({
            title,
            description,
            user: req.user.id
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
});

// get all tasks api
router.get("/", authMiddleware, async(req,res) =>{
  try {
    const tasks = await Task.find({
      user: req.user.id
    });

    res.status(200).json({
      message: "Tasks fetched successfully",
       tasks
    })
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
})

// update task api
router.put("/update/:id", authMiddleware, async(req,res) =>{
  try {
    const {status} = req.body;

    const task = await Task.findOneAndUpdate({
      _id:req.params.id,
      user: req.user.id
    },
    {status},
    {new: true, runValidators: true}
  );

  if(!task){
    return res.status(404).json({
      message: "Task not found"
    })
  }
  res.status(200).json({
    message: "task updated successfully",
    task
  })
  } catch (error) {
    res.status(500).json({
      message: "server error",
      error: error.message
    })
  }
})

// delete task api
router.delete("/delete/:id", authMiddleware, async(req,res) =>{
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if(!task){
      return res.status(404).json({
        message: "Task not found"
      })
    }

    res.status(200).json({
      message: "Task deleted sucessfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "server Error",
      error: error.message
    })
  }
})

module.exports = router;