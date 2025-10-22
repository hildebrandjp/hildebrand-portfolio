ARG RUBY_VERSION=3.4.4
FROM docker.io/library/ruby:$RUBY_VERSION-slim AS base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libjemalloc2 libvips sqlite3 build-essential git libyaml-dev pkg-config && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

ENV APP="/app"
RUN mkdir -p $APP
COPY . $APP/

RUN gem update --system && gem install bundler && \
    gem install foreman

WORKDIR $APP

# Install JavaScript dependencies
RUN npm install && bundle install

# Ensure _site directory exists for rspack output
RUN mkdir -p _site/assets/js

EXPOSE 4000

CMD ["foreman", "start", "-f", "Procfile.dev"]
