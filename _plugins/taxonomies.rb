module TaxonomySystem
  class TaxonomyPage < Jekyll::Page
    def initialize(site, base, taxonomy, posts, dir)
      @site = site
      @base = base
      @dir = "#{dir}/#{taxonomy}"
      @name = "index.html"

      process(@name)
      read_yaml(File.join(base), 'blog/index.html')
      data['taxonomy_view'] = true
      data['taxonomy'] = taxonomy
      data['posts'] = posts
      data['title'] = "Entradas pertenecientes a #{taxonomy}"
    end
  end

  class Taxonomy < Jekyll::Generator
    def generate(site)
      site.tags.each do |tag, posts|
        site.pages << TaxonomyPage.new(site, site.source, tag, posts.reverse, 'tag')
      end
      site.categories.each do |category, posts|
        site.pages << TaxonomyPage.new(site, site.source, category, posts.reverse, 'category')
      end
    end
  end
end
