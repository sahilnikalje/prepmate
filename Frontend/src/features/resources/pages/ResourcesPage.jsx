import { useState, useEffect, useCallback } from "react"
import DashboardLayout  from "../../dashboard/layout/DashboardLayout"
import RecommendedCard  from "../components/RecommendedCard"
import CategoryCard     from "../components/CategoryCard"
import PracticeSetCard  from "../components/PracticeSetCard"
import ContinueLearning from "../components/ContinueLearning"
import AIMentorPanel    from "../components/AIMentorPanel"
import ResourceDetail   from "../components/ResourceDetail"
import resourcesService from "../services/resourcesService"
import { aiMentorInsight, continueLearning } from "../data/resourcesDummyData"

//todo STEP-1: Static icon/color config for categories
const categoryConfig = {
  "DSA":           { icon: "code_blocks", color: "text-primary",   bg: "bg-primary/10"   },
  "React":         { icon: "javascript",  color: "text-secondary", bg: "bg-secondary/10" },
  "Node.js":       { icon: "terminal",    color: "text-[#48e5d0]", bg: "bg-[#48e5d0]/10" },
  "System Design": { icon: "hub",         color: "text-primary",   bg: "bg-primary/10"   },
  "Behavioral":    { icon: "chat",        color: "text-secondary", bg: "bg-secondary/10" },
  "HR":            { icon: "person",      color: "text-[#48e5d0]", bg: "bg-[#48e5d0]/10" },
}

//todo STEP-2: Static icon config for practice sets (featured resources)
const practiceSetConfig = [
  { icon: "javascript",  iconBg: "bg-secondary/10",  iconColor: "text-secondary", badge: "Featured",  badgeColor: "text-secondary bg-secondary/10" },
  { icon: "psychology",  iconBg: "bg-primary/10",    iconColor: "text-primary",   badge: "Top Rated", badgeColor: "text-primary bg-primary/10"     },
  { icon: "terminal",    iconBg: "bg-[#48e5d0]/10",  iconColor: "text-[#48e5d0]", badge: "Popular",   badgeColor: "text-[#48e5d0] bg-[#48e5d0]/10" },
  { icon: "hub",         iconBg: "bg-primary/10",    iconColor: "text-primary",   badge: "Trending",  badgeColor: "text-[#48e5d0] bg-[#48e5d0]/10" },
  { icon: "code_blocks", iconBg: "bg-secondary/10",  iconColor: "text-secondary", badge: "New",       badgeColor: "text-secondary bg-secondary/10" },
]

export default function ResourcesPage() {
  //todo STEP-3: State
  const [resources,    setResources]    = useState([])
  const [categories,   setCategories]   = useState([])
  const [featured,     setFeatured]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [searching,    setSearching]    = useState(false)
  const [error,        setError]        = useState('')
  const [selectedId,   setSelectedId]   = useState(null)

  //todo STEP-4: Filter state
  const [search,       setSearch]       = useState('')
  const [roleFilter,   setRoleFilter]   = useState('')
  const [diffFilter,   setDiffFilter]   = useState('')
  const [catFilter,    setCatFilter]    = useState('')

  //todo STEP-5: Fetch categories + featured on mount
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [catData, featData] = await Promise.all([
          resourcesService.getCategories(),
          resourcesService.getFeatured(),
        ])
        setCategories(catData.categories || [])
        setFeatured(featData.featured || [])
      } catch (err) {
        console.error('Initial fetch failed:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInitial()
  }, [])

  //todo STEP-6: Fetch resources when filters change
  const fetchResources = useCallback(async () => {
    setSearching(true)
    try {
      const data = await resourcesService.getResources({
        search,
        category: catFilter,
        role:     roleFilter,
        difficulty: diffFilter,
      })
      setResources(data.resources || [])
    } catch (err) {
      setError('Failed to load resources')
    } finally {
      setSearching(false)
    }
  }, [search, catFilter, roleFilter, diffFilter])

  //todo STEP-7: Debounce search — wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResources()
    }, 400)
    return () => clearTimeout(timer)
  }, [fetchResources])

  //todo STEP-8: Merge real category counts with visual config
  const mergedCategories = categories.map(cat => ({
    id:    cat._id,
    label: cat._id,
    count: cat.count,
    ...(categoryConfig[cat._id] || { icon: "folder", color: "text-primary", bg: "bg-primary/10" }),
  }))

  //todo STEP-9: Merge featured with visual config
  const mergedFeatured = featured.slice(0, 4).map((f, i) => ({
    id:   f._id,
    title: f.title,
    meta: `${f.type} • ${f.difficulty}`,
    ...(practiceSetConfig[i % practiceSetConfig.length]),
  }))

  //todo STEP-10: First 2 resources as recommended cards
  const recommended = resources.slice(0, 2).map((r, i) => ({
    id:       r._id,
    title:    r.title,
    desc:     `${r.category} — ${r.difficulty} level. Click to view full question and answer.`,
    badge:    `${r.category} • ${r.difficulty}`,
    badgeColor: i === 0 ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary",
    duration: r.duration,
    tags:     r.tags?.slice(0, 2) || [],
    tagStyle: "bg-white/5 text-on-surface-variant",
    cta:      "View Details",
    ctaStyle: i === 0
      ? "bg-gradient-to-r from-primary to-secondary text-on-primary-fixed"
      : "bg-surface-container-high text-on-surface hover:bg-surface-variant",
    size:     "large",
    _id:      r._id,
  }))

  const selectClass = "bg-surface-container-highest text-on-surface text-sm px-4 py-2.5 rounded-full appearance-none outline-none cursor-pointer pr-8"

  return (
    <DashboardLayout>

      {/*//* Atmospheric glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 left-64 w-[400px] h-[400px] bg-[#48e5d0]/5 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 space-y-12 pb-24">

        {/*//* STEP-11: Hero Header */}
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-[0.3em] mb-2">
              AI Learning Hub
            </p>
            <h1 className="font-headline text-4xl lg:text-5xl font-extrabold text-on-surface tracking-tight">
              Interview Resources
            </h1>
            <p className="text-on-surface-variant mt-2 max-w-lg">
              Curated interview preparation resources personalized for your growth.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-[#48e5d0]/10 rounded-full border border-[#48e5d0]/20">
            <div className="w-2 h-2 rounded-full bg-[#48e5d0] animate-pulse" />
            <span className="text-xs font-bold text-[#48e5d0] uppercase tracking-widest">
              AI Recommendations Active
            </span>
          </div>
        </header>

        {/*//* STEP-12: Smart Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
              search
            </span>
            {searching && (
              <svg className="w-4 h-4 animate-spin text-primary absolute right-4 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            )}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search — What do you want to learn about..."
              className="w-full bg-surface-container-highest text-on-surface text-sm pl-11 pr-10 py-3.5 rounded-full outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant/60"
            />
          </div>

          {/*//* Category filter */}
          <div className="relative">
            <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)} className={selectClass}>
              <option value="">All Categories</option>
              <option value="DSA">DSA</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
              <option value="System Design">System Design</option>
              <option value="Behavioral">Behavioral</option>
              <option value="HR">HR</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">expand_more</span>
          </div>

          {/*//* Role filter */}
          <div className="relative">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className={selectClass}>
              <option value="">All Roles</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="General">General</option>
              <option value="HR">HR</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">expand_more</span>
          </div>

          {/*//* Difficulty filter */}
          <div className="relative">
            <select value={diffFilter} onChange={(e) => setDiffFilter(e.target.value)} className={selectClass}>
              <option value="">Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm pointer-events-none">expand_more</span>
          </div>
        </div>

        {/*//* STEP-13: Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <svg className="w-10 h-10 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          </div>
        )}

        {!loading && (
          <>
            {/*//* STEP-14: Recommended Section — first 2 filtered results */}
            {recommended.length > 0 && (
              <section className="space-y-5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                  <h2 className="font-headline font-bold text-2xl text-on-surface">
                    {search || catFilter || roleFilter || diffFilter ? 'Search Results' : 'Recommended for You'}
                  </h2>
                  <span className="text-xs text-on-surface-variant ml-2">
                    {resources.length} resources found
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {recommended.map((r) => (
                    <div key={r.id} onClick={() => setSelectedId(r._id)} className="cursor-pointer">
                      <RecommendedCard resource={r} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/*//* STEP-15: All resources list when searching */}
            {(search || catFilter || roleFilter || diffFilter) && resources.length > 2 && (
              <section className="space-y-3">
                <h3 className="font-headline font-semibold text-lg text-on-surface">All Results</h3>
                <div className="space-y-3">
                  {resources.slice(2).map((r, i) => (
                    <div
                      key={r._id}
                      onClick={() => setSelectedId(r._id)}
                      className="glass-panel rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:border-primary/20 transition-all border border-white/5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-sm">menu_book</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-headline font-semibold text-on-surface">{r.title}</h4>
                        <p className="text-xs text-on-surface-variant mt-0.5">{r.category} • {r.difficulty} • {r.duration}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {r.tags?.slice(0, 2).map((tag, j) => (
                          <span key={j} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-on-surface-variant">{tag}</span>
                        ))}
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/*//* STEP-16: Empty search state */}
            {resources.length === 0 && (search || catFilter || roleFilter || diffFilter) && (
              <div className="text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-3 block">search_off</span>
                <p className="font-semibold">No resources found</p>
                <p className="text-sm mt-1">Try a different search term or filter.</p>
              </div>
            )}

            {/*//* STEP-17: Explore Categories — real counts */}
            {mergedCategories.length > 0 && (
              <section className="space-y-5">
                <h2 className="font-headline font-bold text-2xl text-on-surface">Explore Categories</h2>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {mergedCategories.map((cat) => (
                    <div key={cat.id} onClick={() => setCatFilter(cat.label)} className="cursor-pointer">
                      <CategoryCard category={cat} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/*//* STEP-18: Practice Sets + Continue Learning */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <section className="lg:col-span-8 space-y-5">
                <h2 className="font-headline font-bold text-2xl text-on-surface">Featured Practice Sets</h2>
                <div className="space-y-3">
                  {mergedFeatured.map((set) => (
                    <div key={set.id} onClick={() => setSelectedId(set.id)} className="cursor-pointer">
                      <PracticeSetCard set={set} />
                    </div>
                  ))}
                </div>
              </section>

              <aside className="lg:col-span-4 space-y-5">
                <h2 className="font-headline font-bold text-2xl text-on-surface">Continue Learning</h2>
                <div className="space-y-4">
                  {continueLearning.map((item) => (
                    <ContinueLearning key={item.id} item={item} />
                  ))}
                </div>
              </aside>
            </div>
          </>
        )}

      </div>

      {/*//* STEP-19: Resource Detail Modal */}
      {selectedId && (
        <ResourceDetail
          resourceId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

      {/*//* STEP-20: Floating AI Mentor Panel */}
      <AIMentorPanel insight={aiMentorInsight} />

    </DashboardLayout>
  )
}