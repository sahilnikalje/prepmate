const Resource = require('../../models/Resource.model')

//todo STEP-1: Get all resources with search + filters
const getResources = async (req, res) => {
  try {
    const { search, category, role, difficulty } = req.query

    //todo STEP-2: Build filter object dynamically
    const filter = {}

    if (category)   filter.category   = category
    if (role)       filter.role       = role
    if (difficulty) filter.difficulty = difficulty

    //todo STEP-3: Search by title or question text
    if (search) {
      filter.$or = [
        { title:    { $regex: search, $options: 'i' } },
        { question: { $regex: search, $options: 'i' } },
        { tags:     { $in: [new RegExp(search, 'i')] } },
      ]
    }

    const resources = await Resource.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .select('title category role difficulty type tags duration isFeatured viewCount')

    res.status(200).json({ success: true, count: resources.length, resources })
  } 
  catch (err) {
    console.error('getResourcesErr:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

//todo STEP-4: Get single resource detail by ID
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' })
    }

    //todo STEP-5: Increment view count
    resource.viewCount += 1
    await resource.save()

    res.status(200).json({ success: true, resource })
  }
   catch (err) {
    console.error('getResourceByIdErr:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

//todo STEP-6: Get category counts for category cards
const getCategoryCounts = async (req, res) => {
  try {
    const counts = await Resource.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
    ])

    res.status(200).json({ success: true, categories: counts })
  }
   catch (err) {
    console.error('getCategoryCountsErr:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

//todo STEP-7: Get featured resources
const getFeatured = async (req, res) => {
  try {
    const featured = await Resource.find({ isFeatured: true })
      .sort({ viewCount: -1 })
      .select('title category role difficulty tags duration type')

    res.status(200).json({ success: true, featured })
  }
   catch (err) {
    console.error('getFeaturedErr:', err.message)
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getResources, getResourceById, getCategoryCounts, getFeatured }