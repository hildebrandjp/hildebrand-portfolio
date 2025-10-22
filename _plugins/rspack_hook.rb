Jekyll::Hooks.register :site, :post_write do |site|
  if ENV['NODE_ENV'] == 'production'
    p 'Running Rspack build...'
    system("npm run build-js:prod")
  else 
    # system("npm run build-js:dev")
  end
end