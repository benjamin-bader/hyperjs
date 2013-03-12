OUTDIR=bin
LIB=$(OUTDIR)/hyper.js
CATTED=$(OUTDIR)/catted.js
SPECS := $(shell find spec -type f -name "*.js")

CLEVEL = SIMPLE_OPTIMIZATIONS
CFLAGS = --compilation_level $(CLEVEL) --js_output_file $(LIB)
COMPILE = closure-compiler $(CFLAGS)

SOURCES := $(shell cat BUILD_ORDER | tr '\n' ' ')

all: build test-compiled

clean:
	@if [ -d $(OUTDIR) ]; then rm -rf $(OUTDIR); fi

build: $(LIB)

$(LIB): $(CATTED)
	$(COMPILE) --js $<

test: $(CATTED) $(SPECS)
	for FILE in $(SPECS); do > test.js; cat $(CATTED) > test.js; cat $$FILE >> test.js; jasmine-headless-webkit test.js && rm test.js; done

test-compiled: $(LIB) $(SPECS)
	for FILE in $(SPECS); do > test.js; cat $(LIB) > test.js; cat $$FILE >> test.js; jasmine-headless-webkit test.js && rm test.js; done

$(CATTED): $(SOURCES) | $(OUTDIR)
	@> $@
	@for FILE in $(SOURCES); do cat $$FILE >> $@; done

$(OUTDIR):
	test -d $@ || mkdir $@

